/**
 * Created by hhrosvick on 27/02/14.
 */
var UserFactory = Factories.user;
describe('helpers/routes', function () {
    describe('check_auth', function(){

        it('redirect when no session present', function(){
            var request = { session: { login: null } };
            var response = { redirect: function(url){} };
            helpers.routes.check_auth(request, response, function(){
                fail("Next should not be called");
            });
        });

        it('next called when session present', function(done){
            var request = { session: { login: "valid session" } };
            var response = { redirect: function(url){} };
            helpers.routes.check_auth(request, response, function(){
                done();
            });
        });
    });
});