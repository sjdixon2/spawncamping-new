/**
 * Created by stephen on 03/03/14.
 */

describe('server routing behavior', function(){
    var session;
    var pathWhichDoesNotExist = "/path/does/not/exist";

    describe('404 Handling', function(done){
        it('direct unauthenticated users to 404', function(){
            // expect a redirection to /sessions/new
            var request = {};
            session = new Session();
            session.get(path)
                .expect(404)
                .expect('location', path);
                //.expect(session.title=='404: Page not found');
        });

        it('direct authenticated users to 404', function(){
            session = new Session();
            testHelpers.users.login(session);
            session.get(pathWhichDoesNotExist)
                .expect(404)
                .expect('location', path)
                .end(function(err, res){
                    server.get("/sessions/destroy")
                        .expect(200, done);
                });
        });
    });
});