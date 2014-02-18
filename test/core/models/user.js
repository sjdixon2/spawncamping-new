var UserFactory = Factories.user,
    PhotoFactory = Factories.photo;

describe('User', function () {
    describe('followers', function () {
        it('allows adding of followers', function () {
            //Create test objects to use
            var users = q.all([
                UserFactory.basic(),
                UserFactory.basic()
            ])

            return users.spread(function (followee, follower) {
                //Add follower
                return followee.addFollower(follower).then(function () {
                    //Ensure the relationship was successful
                    return followee.getFollowers().then(function (followers) {
                        followers.should.match(Array).and.have.length(1);
                        followers[0].id.should.match(follower.id);
                    });
                });
            });
        });
    });

    describe('followees', function () {
        it('allows adding of followees', function () {
            var users = q.all([
                UserFactory.basic(),
                UserFactory.basic()
            ])

            return users.spread(function (followee, follower) {
                //Add followee
                return follower.addFollowee(followee).then(function () {
                    //Ensure the relationship was successful
                    return follower.getFollowees().then(function (followees) {
                        followees.should.match(Array).and.have.length(1);
                        followees[0].id.should.match(followee.id);
                    });
                });
            });
        });
    });

    describe('photos', function () {
        it('allows adding of followees', function () {
            var users = q.all([
                UserFactory.basic(),
                PhotoFactory.basic()
            ])

            return users.spread(function (user, photo) {
                //Add photo to user
                return user.addPhoto(photo).then(function () {
                    //Ensure the relationship was successful
                    return user.getPhotoes().then(function (photos) { //The 'e' is intentional; sequelize pluralizes 'photo' to 'photoes'
                        photos.should.match(Array).and.have.length(1);
                        photos[0].id.should.match(photo.id);
                    });
                });
            });
        });
    });
});