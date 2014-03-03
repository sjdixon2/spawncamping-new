/**
 * Created by stephen on 03/03/14.
 */

describe('server routing behavior', function(){
    var session;


    after(function () {
        session.destroy();
    });

    describe('404 Handling', function(done){
        it('should redirect you to 404 only if you are logged in', function(){
            // expect a redirection to /sessions/new
            var request = {};
            var pathWhichDoesNotExist = "/path/does/not/exist";
            session = new Session();
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
            session = new Session();
            testHelpers.users.login(session);
            session.get(pathWhichDoesNotExist)
                .expect(404)
                .expect('location', path);
        });
    });
});