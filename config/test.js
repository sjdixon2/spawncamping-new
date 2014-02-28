//------------------ Configurations specific to test mode ------------------

//Extended settings for test mode
extend(global.settings, {
    db:{
        //NOTE!!!!!! config.json will need to be changed to reflect these changes (to perform migrations)
        TABLE: 'seng_test',
        USERNAME: 'user',
        PASSWORD: 'user',
        options: {
            host: 'localhost',
            port: 3306,
            logging: false //Don't log (clutters console output)
        }
    }
});

global.mocha = require('mocha'); //Test framework
global.should = require('should'); //For assertions
require("mocha-as-promised")(); //For handling promises in tests

global.Factories = requireAll(system.pathTo('test/factories')); //Load factories

require("mocha-as-promised")(); //For handling promises in tests
global.server = require('supertest')(app); //Mock server for testing
