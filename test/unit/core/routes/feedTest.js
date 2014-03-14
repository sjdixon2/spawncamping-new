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
            helpers.pages.extractPageNumber(query).should.be.exactly(expectedOffset);
        }
        it('parses page from query string correctly', function(){
            var query0 = '';
            var query1 = 'page=1';
            var query2 = 'page=2';
            var query3 = 'page=3';
            testOffset(query0, 1);
            testOffset(query1, 1);
            testOffset(query2, 2);
            testOffset(query3, 3);
        });

        it("calculates offset from request correctly", function(){
            session.get('/feed').expect(200);
        });
    })

});