/**
 * Created by stephen on 14/03/14.
 */

var assert = require('assert'),
    request = require('./request'),
    cheerio = require('cheerio'),
    performance = system.performance;

exports.login = function (user) {
    var data = [
        performance.getUrlPath('/sessions/create'),
        {
            username: user.name,
            password: user.password
        }
    ];
    return request.doRequest('post', data).then(function (resp) {
        assert.equal(resp.statusCode, 302);
        assert.equal(resp.headers.location, '/feed');
        var cookie = resp.headers['set-cookie'][0];
        return cookie;
    });
}

exports.loadFeed = function (cookie) {
    var data = [
        performance.getUrlPath('/feed'),
        {
            headers: {
                cookie: cookie
            }
        }
    ];
    return request.doRequest('get', data).then(function (resp) {
        assert.equal(resp.statusCode, 200);
        return resp.body;
    });
}

exports.logout = function (cookie) {
    var data = [
        performance.getUrlPath('/sessions/destroy'),
        {
            headers: {
                cookie: cookie
            }
        }
    ];
    return request.doRequest('get', data).then(function (resp) {
        assert.equal(resp.statusCode, 302);
        return resp;
    });
}


exports.loadImages = function (cookie, body) {
    var $ = cheerio.load(body);

    return q.all($('img').map(function () {
        var url = $(this).attr('src');
        var data = [
            performance.getUrlPath(url),
            {
                headers: {
                    cookie: cookie
                }
            }
        ]
        return request.doRequest('get', data).then(function (resp) {
            assert.equal(resp.statusCode, 200);
        });
    }));
}

exports.runScenario = function (user, i) {
    //Login user
    return exports.login(user).then(function (cookie) {
        var initial = new Date();
        //Load feed
        return exports.loadFeed(cookie).then(function (body) {
            //Load all images on page
            return exports.loadImages(cookie, body).then(function () {
                var endTime = new Date();
                //Logout user
                return exports.logout(cookie).then(function () {
                    //Return scenario results
                    return {time: endTime - initial, requestNo: i};
                });
            });
        });
    });
};
