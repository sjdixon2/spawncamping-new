var path = require('path');

//These get used so much, they may as well be global
global.q = require('q');
global.extend = require('extend');
global.requireAll = require('require-all');
global.express = require('express');
global._ = require('underscore');

//Global configuration settings
global.settings = {
    ROOT_DIR: process.cwd(),
    NODE_ENV: process.env.NODE_ENV,

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
    ext: requireAll(path.join(settings.ROOT_DIR, '/core/ext/'))
};

//Express configuration
global.app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', system.pathTo('core/views/'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(system.pathTo('public/')));

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