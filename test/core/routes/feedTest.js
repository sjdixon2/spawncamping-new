/**
 * Created by stephen on 03/03/14.
 */
describe('feeds', function(){
    var session;
    before(function () {
        //Simulate a user login session
        session = new Session();
        testHelpers.users.login(session);
    });
    after(function () {
        session.destroy();
    });
    describe('show photos', function(){
        it('shows 30 photos on first page', function(done){
            session.get('/feed')
                .expect(302, done);
            session.get('/')
                .expect(302, done);
        });
    })

});