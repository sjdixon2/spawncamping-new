var PhotoFactory = Factories.photo,
    UserFactory = Factories.user;

describe('Photo', function () {
    //this has been tested because createdAt is not done automatically for photos (see photo class)
    describe('createdAt', function () {
        it('is set after creating date', function () {
            var date = new Date(); //The date when ~ the photo is created
            var promise = PhotoFactory.basic();

            return promise.then(function (photo) {
                photo.createdAt.should.be.approximately(date, 1000);
            });
        });

        it('is not changed after update', function () {
            var promise = PhotoFactory.basic();

            return promise.then(function (photo) {
                //Change property of photo
                photo.description = 'new description';

                //Save photo, and ensure createdAt isn't changed
                return photo.save().then(function (updatedPhoto) {
                    photo.createdAt.should.equal(updatedPhoto.createdAt).and.not.equal(null);
                });
            });
        });
    });

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