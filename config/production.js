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