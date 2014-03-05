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
        it('routes are correct', function(done){
            session.get('/feed')
                .expect(302)
                .end(function (err) {
                    if (err) throw err;

                    session.get('/')
                        .expect(302, done);
                });
        });

        function testOffset(query, expectedOffset){
            helpers.pages.getPageNumber(query).should.be.exactly(expectedOffset);
        }
        it('calculates offset correctly', function(){
            var query0 = '';
            var query1 = 'page=2';
            var query2 = 'page=3';
            testOffset(query0, 0);
            testOffset(query1, 1);
            testOffset(query2, 2);
        });
    })

});