var path = require('path');

//These get used so much, they may as well be global
global.q = require('q');
global.extend = require('extend');
global.requireAll = require('require-all');
global.express = require('express');
global._ = require('lodash');
global.http = require('http');
global.flash = require('express-flash'); //For sending temporary messages to redirects
global.fs = require('fs'); //For file system calls
global.path = require('path');
global.url = require('url');
global.moment = require('moment');
global.gm = require('gm');
global.sizeOf = require('image-size');
global.Chance = require('chance'); //For generating random names, dates, etc.

//Global configuration settings
global.settings = {
    ROOT_DIR: process.cwd(),
    NODE_ENV: process.env.NODE_ENV,
    UPLOADS_PATH: 'public/uploads',
    UPLOADS_URL_PATH: '/photos/',
    LOG_PATH: 'logs/',
    ADMIN_PASSWORD: 'spawncamping', //Password given by TA for bulk upload security

    /*
     To use this connection string, run the following commands in your localhost mysql

     CREATE USER 'user'@'localhost';
     GRANT ALL PRIVILEGES ON *.* TO 'user'@'localhost' WITH GRANT OPTION;
     SET PASSWORD FOR 'user'@'localhost' = PASSWORD('user');

     CREATE DATABASE seng_development;
     */
    db: {
        //NOTE!!!!!! config.json will need to be changed to reflect these changes (to perform migrations)
        TABLE: 'seng_development',
        USERNAME: 'user',
        PASSWORD: 'user',
        options: {
            host: 'localhost',
            port: 3306
        }
    }
};

//System functions/required modules
global.system = {
    pathTo: function (/**..args**/) {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(settings.ROOT_DIR);
        return path.join.apply(null, args);
    },
    /**
     * @example
     * getPath('/p/a/t/h', {query: 'myquery'}) => '/p/a/t/h?query=myquery'
     *
     * @param path the url path
     * @param [query] any query parameters to send
     * @param [options] additional url options (e.g. host, port)
     * @returns {string}
     */
    getUrlPath: function (path, query, options) {
        return url.format(_.extend({pathname: path, query: query}, options));
    },
    ext: requireAll(path.join(settings.ROOT_DIR, '/core/ext/')),
    //Settings for performance mode
    performance: {
        hostname: 'localhost', //Change this to test performance on localhost
        ROOT_DIR: process.cwd(), //Also change this to the path to your repository (for image upload)
        protocol: 'http',
        port: 8800,
        pathTo: function (/**..args**/) {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(this.ROOT_DIR);
            return path.join.apply(null, args)
                .replace(/\\/g,'/'); //Replace all black slashes (Windows) with forward slashes (so the path can be used on Linux)
        },
        /**
         * @example
         * If performance server host is host.com:80, then
         *      getPath('/p/a/t/h', {query: 'myquery'}) => 'host.com:80/p/a/t/h?query=myquery'
         *
         * @param path the url path
         * @param [query] any query parameters to send
         * @returns {string}
         */
        getUrlPath: function (path, query) {
            return system.getUrlPath(path, query, {hostname: this.hostname, port: this.port, protocol: this.protocol});
        }
    }
};

//Database Logging
if (!fs.existsSync(system.pathTo(settings.LOG_PATH))) { //Create log folder if it doesn't exist
    fs.mkdirSync(system.pathTo(settings.LOG_PATH));
};

var queryLog = fs.createWriteStream(system.pathTo(settings.LOG_PATH+'queries.txt'), {
    flags: 'w'
});

global.settings.db.options.logging = function(toLog){
    var date = new Date();
    queryLog.write(date.getTime() + 'ms : ' +  date.toUTCString() + ' ' + toLog + '\n');
};

//Express configuration
global.app = express();
app.set('port', process.env.PORT || 8800);
app.set('views', system.pathTo('core/views/'));
app.set('view engine', 'jade');
app.use(express.favicon());


// Request Logging
express.logger.token('user', function(req, res){
    return (req.session && req.session.login) ? req.session.login.id : 'anonymous';
});

express.logger.token('session', function(req, res){
    return req.sessionID || 'null';
});

app.use(express.logger({
    format: ':date [:remote-addr] [:session] [:user] [:response-time ms] [req::req[Content-Length] res::res[Content-Length]] :method :status :url ',
    immediate: false,
    stream: fs.createWriteStream(system.pathTo(settings.LOG_PATH+'requests.txt'), {
        flags: 'w'
    })
}));

app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb'}));
app.use(express.multipart());
app.use(express.methodOverride());

// Session Management
app.use(express.cookieParser());
app.use(express.session({secret: 'spawncampingsupersecuresession'}));

//Configure flash messages
app.use(flash());

//Helper functions for user login in Jade templates
app.use(function(req,res,next){
    /**
     * Indicates if the user is logged in
     * @returns {boolean}
     */
    res.locals.userLoggedIn = function () {
        return req.session.login;
    }

    //Direct access to logged in user object
    res.locals.user = req.session.login;

    next();
});

app.use(app.router);
app.use(express.static(system.pathTo('public/')));
app.use(settings.UPLOADS_URL_PATH, express.static(system.pathTo(settings.UPLOADS_PATH))); //Direct photo requests to uploads folder

// Load mode-specific configurations
switch (settings.NODE_ENV) {
    case 'development':
        require('./development.js');
        break;
    case 'production':
        require('./production.js');
        break;
    case 'test':
        require('./test.js');
        break;
}
require('./my_config'); //Load computer-specific configurations

global.helpers = requireAll(system.pathTo('/core/helpers/'));
global.classes = require(system.pathTo('/core/classes/'));
global.db = require(system.pathTo('core/models/'));

//Load routes configurations
require(system.pathTo('routes/config'));

//Create image upload directories, if they don't exist already
helpers.system.createImageUploadDirectories();

//Allow access to globals in Jade files
app.locals.db = db;