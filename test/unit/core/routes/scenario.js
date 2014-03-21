// Scenario
//  New User is created
//  Create a user to follow
//  Add photos
// Check feed

var UserFactory = Factories.user;
describe('Scenario', function(){

    var session;

    before(function () {
        //Simulate a user login session
        session = new Session();
        return testHelpers.users.login(session);
    });

    after(function () {
        session.destroy();
    });

    // Creates new user
    describe('create user', function(){
        it("creates a user", function(done) {
            var data = {
                fullname: "Test User",
                username: "users_create@email.com",
                password: "123456"
            };

            server.post("/users/create")
                .type("application/json")
                .send(data)
                .end(function(err, res){

                    db.User.find({
                        where: { email: "users_create@email.com"}
                    }).then(function(user){
                            if(user) user.destroy();
                        });

                    // Navigate to feed views feed
                    server.get("/feed")
                        .set("cookie", res.header["set-cookie"])
                        .expect(200, done);

                });
        });

    });

    // Creates a user to follow
    describe('follow', function(){
        it("makes the current user follow the specified user", function(done) {
            //Create test followee
            UserFactory.basic().then(function (followee) {
                session.get('/users/' + followee.id + '/follow')
                    .send({id: followee.id})
                    .expect(302)
                    .end(function(err, res){
                        if (err) throw err;

                    //Ensure the relationship was created
                    followee.getFollowers().then(function (followers) {
                        followers.length.should.equal(1);
                        done();
                    });
                });
            });
        });
    });

    describe('upload', function () {
        it('jpg image', function (done) {
            var uploadFileDirectory = system.pathTo(settings.UPLOADS_PATH),
                photoUploadCount = fs.readdirSync(uploadFileDirectory).length;

            session.post('/photos/create')
                .expect(302)
                .attach('image', system.pathTo('test/unit/fixtures/routes/photos/valid.jpg'))
                .expect('location', '/feed')
                .end(function (err) {
                    if (err) throw err;

                var newPhotoUploadCount = fs.readdirSync(uploadFileDirectory).length;

                //Ensure that 'a file' was added to uploads directory
                newPhotoUploadCount.should.be.greaterThan(photoUploadCount);
                done();
            });
        });
    });

    // check feed
    describe('show photos', function(){
        it('routes are correct', function(done){
            session.get('/feed')
                .expect(200)
                .end(function (err) {
                    if (err) throw err;

                session.get('/')
                    .expect(302, done);
            });
        });
    });
});
