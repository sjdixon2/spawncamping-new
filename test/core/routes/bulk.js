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

                            //TODO: link all followers together

                            done();
                        });
                    });
                });
            });

        });
    });

    describe('users', function () {
        it('Creates users given in JSON', function (done) {
            var body = [
                {id: 1, name: 'jill', follows: [2, 3], password: 'test1'},
                {id: 2, name: 'alice', follows: [3], password: 'test2'},
                {id: 3, name: 'tim', follows: [1, 2], password: 'test3'}
            ];

            //Clear DB (required for bulk upload)
            clearAll(function () {
                //Perform bulk upload request
                server.post('/bulk/users').send(body)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) throw err;

                        //Ensure test data was created in database
                        db.User.findAll().then(function (users) {
                            users.length.should.equal(3);

                            users[2].password.should.equal('test3');
                            users[2].fullName.should.equal('tim');

                            //Ensure each user has to proper amount of followers
                            users[2].getFollowers().then(function (followers) {
                                followers.length.should.equal(2);
                                done();
                            });
                        });
                    });
            })
        });
    });
});