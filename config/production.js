//------------------ Configurations specific to production mode ------------------

//Extended settings for development mode
extend(global.settings, {
    db:{
        TABLE: 'seng_development',
        USERNAME: 'user',
        PASSWORD: 'user',
        options: {
            host: 'localhost',
            port: 3306
        }
    }
});