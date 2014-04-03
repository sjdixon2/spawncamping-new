//------------------ Configurations specific to production mode ------------------

//Extended settings for production mode
extend(global.settings, {
    db:{
        //NOTE!!!!!! config.json will need to be changed to reflect these changes (to perform migrations)
        TABLE: 's513_sjdixon',
        USERNAME: 's513_sjdixon',
        PASSWORD: '10037023',
        options: {
            host: 'web2.cpsc.ucalgary.ca',
            port: 3306
        }
    }
});
