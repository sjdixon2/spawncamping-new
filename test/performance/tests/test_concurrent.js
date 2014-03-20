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
//                var options = {
//                    //follow: true,
//                    auth: 'digest'
//                }
                var needlePost = q.defer();
                needle.post("localhost:8800/sessions/create", data, function(err,resp,body){
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
                        context['loginCookie'] = resp.headers['set-cookie'][0];
                        needlePost.resolve(context);
                    }
                });
                return needlePost.promise;
            })
            .then(function(loginContext){
                var deferred = q.defer();
                var options = {
                    headers : {
                        "set-cookie" : loginContext['loginCookie']
                    }
                };
                needle.get("localhost:8800/feed", options, function(err, resp){
                    printArguments(err, resp);
                    if(err){
                        console.log(error);
                        var error = new Error(err);
                        needlePost.reject(error);
                        throw error;
                    }
                    else {

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