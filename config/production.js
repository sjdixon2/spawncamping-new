//------------------ Configurations specific to production mode ------------------

//Extended settings for production mode
extend(global.settings, {
    db:{
        //NOTE!!!!!! config.json will need to be changed to reflect these changes (to perform migrations)
        TABLE: 's513_jpnauta',
        USERNAME: 's513_jpnauta',
        PASSWORD: '10054069',
        options: {
            host: 'web2.cpsc.ucalgary.ca',
            port: 3306
        }
    }
});


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

//Write express logs to file
app.use(express.logger({
    format: ':date [:remote-addr] [:session] [:user] [:response-time ms] [req::req[Content-Length] res::res[Content-Length]] :method :status :url ',
    immediate: false,
    stream: fs.createWriteStream(system.pathTo(settings.LOG_PATH+'requests.txt'), {
        flags: 'w'
    })
}));
