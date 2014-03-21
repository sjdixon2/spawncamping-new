/**
 * Created by hhrosvick on 27/02/14.
 */

// check_auth UNIT TESTS
describe('helpers/routes', function () {
    describe('check_auth unit tests', function(){

        // Navigate to page with INVALID login session
        //      should redirect to login page
        it('redirect when no session present', function(){

            // Setup invalid login session and navigate to a page
            var req = { session: { login: null } };
            var res = { redirect: function(url){} };

            // Call check_auth, response should be a redirect to login page
            helpers.routes.check_auth(req, res, function(){
                res.header.location.should.include('/sessions/new');
            });
        });

        // Navigate to page with VALID login session
        //      should navigate to target url
        it('next called when session present', function(done){

            // Setup invalid login session and navigate to a page
            var req = { session: { login: 'valid session' } };
            var res = { redirect: function(url){} };

            // Call check_auth, function completes successfully
            helpers.routes.check_auth(req, res, function(){

            });
            done();
        });
    });
});
