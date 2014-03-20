/**
 * Created by stephen on 14/03/14.
 */

var needle = require('needle');
var assert = require('assert');
var request = require('./request');

exports.login = function(context){
    var data = [
        "localhost:8800/sessions/create",
        {
            username: "test5",
            password: "test"
        }
    ];
    return request.doRequest("post", data).then(function (resp){
        console.log("request finished");
        assert.equal(resp.statusCode, 302);
        assert.equal(resp.headers.location, "/feed");
        console.log("assertions passed");
        context['cookie'] = resp.headers['set-cookie'][0];
        context['loginTime'] = new Date();
        return 123;
    });
}


exports.loadFeed= function(context){
    console.log("getting feed..");
    var data = [
        "localhost:8800/feed",
        {
            cookie: context['cookie']
        },
        {
            Connection: "keep-alive"
        }
    ]
    return request.doRequest("get", data).then(function(resp){
        console.log("rendered");
        assert.equal(resp.statusCode, 200);
        //console.log(body);
        return context;
    });
}

exports.logout= function(context){
    return context;
}


exports.runScenario = function(user){
    var deferred = q.defer();
    var context = {
        user: user,
        initial : new Date()
    };

    return exports.login(context)
        .then(function(c){
            console.log("got here");
            return exports.loadFeed(c);
        })
        .then(exports.logout);
};
