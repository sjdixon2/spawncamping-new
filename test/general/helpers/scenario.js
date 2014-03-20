/**
 * Created by stephen on 14/03/14.
 */

var needle = require('needle');
var assert = require('assert');
var request = require('./request');

exports.login = function (user) {
    var data = [
        "localhost:8800/sessions/create",
        {
            username: user.email,
            password: "test"
        }
    ];
    return request.doRequest("post", data).then(function (resp) {
        console.log("request finished");
        assert.equal(resp.statusCode, 302);
        assert.equal(resp.headers.location, "/feed");
        console.log("assertions passed");
        return resp.headers['set-cookie'][0];
    });
}


exports.loadFeed = function (cookie) {
    var data = [
        "localhost:8800/feed",
        {
            cookie: cookie
        },
        {
            Connection: "keep-alive"
        }
    ]
    return request.doRequest("get", data).then(function (resp, body) {
        console.log("rendered");
        assert.equal(resp.statusCode, 200);
        return body;
    });
}

exports.logout = function () {
    return;
}

exports.loadImages = function(body){

}

exports.runScenario = function (user) {
    return exports.login(user).then(function (cookie) {
        var initial = new Date()
        return exports.loadFeed(cookie).then(function(body) {
            return exports.loadImages(body).then(function () {
                return exports.logout().then(function(){
                    var endTime = new Date();
                    return {time: endTime - initial, asd: 1};
                });
            });
        });
    });
};
