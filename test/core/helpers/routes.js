/**
 * Created by hhrosvick on 27/02/14.
 */
var UserFactory = Factories.user;

describe('Helpers/Routes', function () {

    var http = require('http');
    var server;

    var options = {
        hostname: "localhost",
        port: app.get('port')
    };

    before(function(done){
        var http = require('http');

        //Load routes configurations
        require('../../../routes/config.js');
        server = http.createServer(app).listen(app.get('port'));
        UserFactory.basic().done(done);
    });

    after(function() {
        server.close();
    });

    describe('check_auth - Integration Tests', function () {

        it("redirects when no session present", function (done) {

            options.path = "/feed";
            options.method = "GET";

            http.request(options, function(res){
                res.statusCode.should.equal(302);
                done();
            }).end();
        });

        it("continues if session is present", function (done) {

            var data = {
                username: "user1@email.com",
                password: "123456"
            };

            var options2 = options;

            options.path = "/sessions/create";
            options.method = "POST";
            options.headers = {
                "Content-Type": "application/json"
            };

            var req = http.request(options);

            req.on('response', function(res){

                //get session cookie so it can be forwarded.
                var session = res.headers["set-cookie"];

                options2.path = "/feed";
                options2.method = "GET";
                options2.headers = {
                    cookie: session
                };

                var req2 = http.request(options2);

                req2.on('response', function(res2){
                    res2.statusCode.should.equal(200);
                    done();
                });

                req2.end();
            });
            req.end(JSON.stringify(data));
        });
    });

    describe('check_auth - Unit Tests', function(){

        it('returned a blank redirect when no session present and originating url is "/"', function(){
            var req = {
                session: {
                    login: null
                },
                url: "/"
            };

            var res = {
                url: "not-a-valid-url",
                redirect: function(url){
                    this.url = url;
                },
                end : function(){}
            };

            helpers.routes.check_auth(req, res, function(){
                res.url.should.equal("/sessions/new");
            });
        });

        it('returned a correct redirect when no session present and originating url is not "/"', function(){
            var req = {
                session: {
                    login: null
                },
                url: "/this-is-the-correct-redirect"
            };

            var res = {
                url: "not-a-valid-url",
                redirect: function(url){
                    this.url = url;
                },
                end : function(){}
            };

            helpers.routes.check_auth(req, res, function(){
                res.url.should.equal("/this-is-the-correct-redirect");
            });
        });

        it('returned no redirect when a session is present and called next', function(){
            var req = {
                session: {
                    login: "NOT NULL"
                },
                url: "/"
            };

            var res = {
                url: "/will-continue",
                redirect: function(url){
                    this.url = url;
                },
                end : function(){}
            };

            helpers.routes.check_auth(req, res, function(){
                res.url.should.equal("/will-continue");
            });
        });
    });
});