var PhotoFactory = Factories.photo,
    UserFactory = Factories.user;

describe('Photo', function () {
    describe('user', function () {
        it('allows the setting of user', function () {
            //Create test objects to use
            var promise = q.all([
                UserFactory.basic(),
                PhotoFactory.basic()
            ]);

            return promise.spread(function (user, photo) {
                return photo.setUser(user).then(function () {
                    //Ensure relationship was established
                    return photo.getUser().then(function (userFound) {
                        userFound.id.should.equal(user.id);
                    });
                });
            });
        });
    });
});