/**
 * Created by stephen on 03/03/14.
 */

describe('server routing behavior', function(){
    var session;

    before(function () {
        session = new Session();
        return testHelpers.users.login(session);
    });


    describe('when path does not exist', function(done){
        it('when not logged in, redirect to login form and then continue to 404', function(){
            // expect a redirection to /sessions/new
            var request = {};
            var pathWhichDoesNotExist = "/path/does/not/exist";
            session.get("/sessions/destroy");
            session.get(path)
                .expect(302)
                .expect('location', '/sessions/new');
            // after login, and then get 404.
            session = new Session();
            testHelpers.users.login(session);
            session.get(path)
                .expect(404)
                .expect('location', path);
        });

        it('when logged in, return 404 error', function(){
            var pathWhichDoesNotExist = "/path/does/not/exist";
            session.get(pathWhichDoesNotExist)
                .expect(404)
                .expect('location', path);
        });
    });
});