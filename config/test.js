//------------------ Configurations specific to test mode ------------------

global.mocha = require('mocha'); //Test framework
global.should = require('should'); //For assertions
global.Factory = require('factory-lady'); //For creating test objects by factory

//Extended settings for test mode
extend(global.settings, {
    db:{
        //NOTE!!!!!! config.json will need to be changed to reflect these changes (to perform migrations)
        TABLE: 'seng_test',
        USERNAME: 'user',
        PASSWORD: 'user',
        options: {
            host: 'localhost',
            port: 3306
        }
    }
});