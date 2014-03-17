/**
 * Created by stephen on 14/03/14.
 */
var auth = require('./users');


// This is the actual test run by concurrent and follower tests.

exports.runScenario = function(i){
    console.log("arg1: " + i);
    // login
    return i;

    // go to feed

    // compute response time measured as follows:
    // time to first image

    // log all other images?

    // time to last image

    // logout
}
