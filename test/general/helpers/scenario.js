/**
 * Created by stephen on 14/03/14.
 */

var needle = require('needle');
var assert = require('assert');
var request = require('./request');

exports.login = function(context){
//    var deferred = q.defer();
//    console.log("login");
//    var args = [
//        "localhost:8800/sessions/create",
//        {
//            username: context['user'].email,
//            password: "test"
//        },
//        {
//            Connection: "keep-alive"
//        }
//    ]
//    request.doRequest("post", args).then(function(resp){
//        console.log("resp");
//        context['cookie'] = resp.headers['set-cookie'][0];
//        //assert.equal(resp.statusCode, 302);
//        //assert.equal(resp.headers.location, "/feed");
//        deferred.resolve(context)
//    })
//
//    return deferred.promise;
    return 10;
}


exports.runScenario = function(user){
    console.log(user);
    var deferred = q.defer();

    var context = {
        user: user,
        initial : new Date()
    };

    setTimeout(function(){
        deferred.resolve(10);
    }, 1000);
    return deferred.promise;
};
