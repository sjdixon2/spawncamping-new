/**
 * Created by stephen on 14/03/14.
 */

var assert = require('assert');
var request = require('./request');
var cheerio = require('cheerio');

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
        var cookie = resp.headers['set-cookie'][0];
        //console.log(cookie);
        return cookie;
    });
}

exports.loadFeed = function (cookie) {
    console.log(cookie);
    var data = [
        "localhost:8800/feed",
        {
            headers: {
                cookie: cookie
            }
        }
    ];
    return request.doRequest("get", data).then(function (resp) {
        console.log("img");
        assert.equal(resp.statusCode, 200);
        return resp.body;
    });
}

exports.logout = function (cookie) {
    var data = [
        "localhost:8800/sessions/destroy",
        {
            headers: {
                cookie: cookie
            }
        }
    ];
    return request.doRequest("get", data).then(function (resp) {
        console.log("logout");
        assert.equal(resp.statusCode, 302);
        return resp;
    });
}


exports.loadImages = function(cookie, body){
    console.log("Loading body:\n\t" + body);

    var $ = cheerio.load(body);
    assert($('img').length);
    return q.all(
        $('img').each(function(){
            var url = $(this).attr('src');
            console.log("url: " + url);
            var data = [
                url,
                {
                    headers: {
                        host: 'localhost:8080',
                        cookie: cookie
                    }
                }
            ]
            return request.doRequest("get", data).then(function (resp) {
                console.log("img rendered");
                assert.equal(resp.statusCode, 200);
                return i;
            });
        })
    );

}

exports.runScenario = function (user, i) {
    return exports.login(user).then(function (cookie) {
        var initial = new Date();
        return exports.loadFeed(cookie).then(function(body) {
            return exports.loadImages(cookie,body).then(function (u1) {
                return exports.logout(cookie).then(function(u2){
                    var endTime = new Date();
                    return {time: endTime - initial, requestNo: i};
                });
            });
        });
    });
};
