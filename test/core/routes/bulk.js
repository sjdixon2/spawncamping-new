var UserFactory = Factories.user,
    PhotoFactory = Factories.photo;

describe('bulk routes', function () {
    /**
     * Calls route to clear DB, then calls callback function
     * @param cb callback function
     */
    function clearAll(cb) {
        server.get('/bulk/clear').expect(200, 'DB cleared').end(function (err) {
            if (err) throw err;
            return cb();
        });
    }

    /**
     * Calls bulk upload route to add users to DB, then calls callback function
     * @param users the users to create (see project documentation)
     * @param cb callback function
     */
    function createUsers(users, cb) {
        //Perform bulk upload request
        server.post('/bulk/users').send(users)
            .expect(200)
            .end(function (err) {
                if (err) throw err;
                cb();
            });
    }

    /**
     * Calls bulk upload route to add photo to DB, then calls callback function
     * @param photos the photos to create (see project documentation)
     * @param cb callback function
     */
    function createPhotos(photos, cb) {
        //Perform bulk upload request
        server.post('/bulk/streams').send(photos)
            .expect(200)
            .end(function (err) {
                if (err) throw err;
                cb();
            });
    }

    describe('clear', function () {
        it('It deletes all data in the table', function (done) {
            //Create dummy items in DB
            var promise = q.all(
                UserFactory.basic(),
                PhotoFactory.basic()
            );

            promise.then(function () {
                //Perform DB clear
                clearAll(function () {
                    //Ensure databases are empty
                    db.User.count().success(function (userCount) {
                        db.Photo.count().success(function (photoCount) {
                            userCount.should.equal(0);
                            photoCount.should.equal(0);

                            done();
                        });
                    });
                });
            });

        });
    });

    describe('users', function () {
        it('Creates users given in JSON', function (done) {
            var users = [
                {id: 1, name: 'jill', follows: [2, 3], password: 'test1'},
                {id: 3, name: 'tim', follows: [1, 2], password: 'test3'},
                {id: 2, name: 'alice', follows: [3], password: 'test2'}
            ];

            //Clear DB (required for bulk upload)
            clearAll(function () {
                //Create given users
                createUsers(users, function () {

                    //Ensure test data was created in database
                    db.User.findAll().then(function (users) {
                        users.length.should.equal(3);

                        users[2].password.should.equal('test3');
                        users[2].fullName.should.equal('tim');
                        users[2].id.should.equal(3);

                        //Ensure each user has to proper amount of followers
                        users[2].getFollowers().then(function (followers) {
                            followers.length.should.equal(2);
                            done();
                        });
                    });
                });
            });
        });
    });

    describe('streams', function () {
        it('Creates photos given in JSON', function (done) {
            var users = [
                {id: 1, name: 'jill', follows: [2, 3], password: 'test1'},
                {id: 3, name: 'tim', follows: [1, 2], password: 'test3'},
                {id: 2, name: 'alice', follows: [3], password: 'test2'}
            ];

            var imagePath = system.pathTo('test/fixtures/routes/bulk/image.png'),
                photos = [
                    {id: 1, user_id: 3, path: imagePath, timestamp: 1392403505782},
                    {id: 2, user_id: 2, path: imagePath, timestamp: 1392305505782},
                    {id: 4, user_id: 2, path: imagePath, timestamp: 1392405505781},
                    {id: 5, user_id: 2, path: imagePath, timestamp: 1392405505782},
                    {id: 3, user_id: 1, path: imagePath, timestamp: 1392404505782}
                ];

            //Simulate pre-requisite clear & user creation
            clearAll(function () {
                createUsers(users, function () {
                    //Create test photos
                    createPhotos(photos, function () {
                        //Ensure test data was created in database
                        db.Photo.findAll().then(function (photos) {
                            photos.length.should.equal(5);

                            photos[4].id.should.equal(5);
                            photos[4].imagePath.should.equal(system.pathTo(settings.UPLOADS_PATH, '5.png'));
                            photos[4].createdAt.should.be.approximately(1392405505782, 1000); //Had to approximate, as the milliseconds are different

                            //Ensure photos were added to users
                            db.User.find(2).then(function (user) {
                                user.getPhotoes().then(function (photos) {
                                    photos.length.should.equal(3);
                                    done();
                                });
                            })
                        });
                    });
                });
            });
        });
    });
});