/**
 * Created by stephen on 14/03/14.
 */

var needle = require('needle');
var assert = require('assert');
var request = require('./request');
// This is the actual test run by concurrent and follower tests.

exports.login = function(context){
    console.log("login");
    console.log("deferring");
    context['loginTime'] = new Date();
    var data = "username="+context['user'].email;
//    {
//        username: context['user'].email,
//        password: 'test'
//    };
    console.log("data: " + data);

    var headers = {

    };
    var deferred = q.defer();
    q.fcall(needle.post("http://localhost:8800/sessions/create", data, function(err, resp, body){
        console.log("something");
        console.log("err:" + err);
        console.log("resp:" + resp);
        console.log("body:" + body);
        if(!err){
            var error = new Error(err);
            deferred.reject(error);
            throw new Error(error);
        }
        else {
            context['loggedIn'] = true;
            deferred.resolve(context);
        }
    }));
    return deferred.promise;
};

exports.captureMetrics = function(context){
    console.log("Capture @ " + new Date());
    var deferred = q.defer();
    context['captured'] = new Date();
    console.log("result: " + JSON.stringify(context));
    deferred.resolve(context);
    return deferred.promise;;
};

exports.logout = function(context){
    console.log("Logout @ " + new Date());

    var deferred = q.defer();
    context['session'].get("/sessions/destroy")
        .send()
        .expect(404)
        .expect('location', '/sessions/new');
    deferred.resolve(context);
    return deferred.promise;
};

exports.runScenario = function(user){
    var deferred = q.defer();
    var context = {
        user: user,
        initial : new Date(),
        session: new Session()
    };

    q.nfcall(exports.login, context)
        .then(function(c1){
            console.log("Context: " + c1);
            return exports.logout(c1);
        })
        .then(function(c2){
            return exports.captureMetrics(c2)
        })
        .then(function(c3){
            deferred.resolve(c3)
        })
        .fail(function(err){
            console.log("Caught error");
            deferred.reject(new Error(err));
            throw new Error(err);
        });


    return deferred.promise;
};
