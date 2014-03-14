process.env.NODE_ENV = 'test'; //Force environment to test mode

require('../../config'); //Load system configuration

//Import all tests in this test folder
requireAll(__dirname);