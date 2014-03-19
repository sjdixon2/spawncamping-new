/**
 * Created by hhrosvick on 18/03/14.
 */

var UserFactory = Factories.user;

var test_routes = [
    {route:'/', redirect: true, validLocation: '/feed'},
    {route:'/feed', redirect: true},
    {route:'/users/new', redirect: false},
    {route:'/sessions/new', redirect: false, validLocation: '/'},
    {route:'/photos/new', redirect: true},
    {route:'/sessions/destroy', redirect: true, validLocation: '/'}
];

describe('D2 Functional Testing', function () {

    var session;

    before(function(done){
        session = new Session();
        testHelpers.users.login(session).done(function(){
            var validUserID = UserFactory.lastID();
            test_routes.push({route:'/users/'+validUserID+'/share', redirect: true, validLocation: '/users/' + validUserID});
            test_routes.push({route:'/users/'+validUserID, redirect: true});
            test_routes.push({route:'/users/'+validUserID+'/follow', redirect: true, validLocation: '/users/' + validUserID});
            test_routes.push({route:'/users/'+validUserID+'/unfollow', redirect: true, validLocation: '/users/' + validUserID});
            done();
        });
    });

    after(function () {
        session.destroy();
    });

    describe('redirects for invalid user', function(){
        it("redirects correctly", function (done) {
            test_routes.forEach(function(r){
                var req = server.get(r.route);
                if(r.redirect) {
                    req.expect(302).expect('location', '/sessions/new');
                } else {
                    req.expect(200);
                }
            });
            done();
        });
    });

    describe('does not redirect for valid user', function(){
        it("completes correctly", function (done) {
            test_routes.forEach(function(r){
                var req = session.get(r.route);
                if(r.validLocation){
                    req.expect(302).expect('location', r.validLocation);
                } else {
                    req.expect(200);
                }
            });
            done();
        });
    });
});