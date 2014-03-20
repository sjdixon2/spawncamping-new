var runSet = testHelpers.runSet;
var scenario = testHelpers.scenario;
var reporter = testHelpers.reporter;
var promise = require('promises');
var needle = require('needle');
var assert = require('assert');
var bulk = testHelpers.bulk;

describe('Response Time due to Number of Concurrent Sessions', function () {

    function printArguments(err, resp){
        console.log("err:" + err);

        // look at whats inside resp
        var cache = [];
        console.log("resp:" + JSON.stringify(resp, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        }));
        cache = null; // Enable garbage collection
        //done looking
    }

    it('Varies due to scaling number of concurrent sessions', function () {
//        return runSet.byConcurrentSessions(1, scenario.runScenario)
//            .then(reporter.print_results);
    });

    it("varies using promises only", function(){
        var deferred = q.defer();
        var prom = bulk.generateUsersAndFollowers(5)
            .then(function(followers){
                //console.log(followers);
                return userToTest = _.max(followers, function(follower){
                    return follower.id;
                })
            })
            .then(function(user){
                console.log(user);
                var context = {
                    user: user,
                    initial : new Date()
                }
                var data = {
                    username: context['user'].email,
                    password: 'test'
                };
                var options = {
                    headers:
                    {
                        Connection: "keep-alive"
                    }
                }
                var needlePost = q.defer();
//                testHelpers.request.doRequest('post', ["localhost:8800/sessions/create", data, options]).then(function resp, body) {
//
//                }
                needle.post( function(err,resp,body){
                    printArguments(err,resp);
                    if(err){
                        var error = new Error(err);
                        needlePost.reject(error);
                        throw error;
                    }
                    else {
                        context['loggedIn'] = true;
                        context['loginTime'] = new Date();
                        assert.equal(resp.statusCode, 302);
                        assert.equal(resp.headers.location, "/feed");
                        assert(resp.headers['set-cookie'][0]);
                        console.log("got 200");
                        var cookie = resp.headers['set-cookie'][0];
//                        cookie = cookie.substr(0, cookie.indexOf(';'));
                        context['loginCookie'] = cookie;
                        needlePost.resolve(context);
                    }
                });
                return needlePost.promise;
            })
            .then(function(loginContext){
                var deferred = q.defer();
                var options = {
                    headers : {
                        Host: "localhost:8080",
                        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                        "Accept-Language": "en-gb,en;q=0.5",
                        "Accept-Encoding": "gzip, deflate",
                        DNT: 1,
                        referer: 'localhost:8800/sessions/new',
                        "cookie" : loginContext['loginCookie'],
                        connection : "keep-alive"
                    }
//                    username: 'test5',
//                    password: 'test',
//                    auth: 'digest'
                };
                needle.get("localhost:8800/feed", options, function(err, resp){
                    printArguments(err, resp);
                    if(err){
                        console.log(error);
                        var error = new Error(err);
                        deferred.reject(error);
                        throw error;
                    }
                    else {
                        loginContext['gotFeed'] = new Date();
                        deferred.resolve(loginContext);
                        assert.equal(resp.statusCode, 200);
                        assert.equal(resp.headers.location, "/feed")
                    }
                })
                return deferred.promise;
            })
            .then(function(result){
                console.log(result);
                deferred.resolve(result);
            })
        return deferred.promise;
    });
});