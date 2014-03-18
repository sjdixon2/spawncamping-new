var UserFactory = Factories.user,
    PhotoFactory = Factories.photo;

describe('User', function () {
    describe('followers', function () {
        it('allows adding of followers', function () {
            //Create test objects to use
            var users = q.all([
                UserFactory.basic(),
                UserFactory.basic()
            ]);

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
            ]);

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
            //Create test objects to use
            var users = q.all([
                UserFactory.basic(),
                PhotoFactory.basic()
            ]);

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

    describe('photoShares', function () {
        it('allows sharing of photos', function () {
            var users = q.all([
                UserFactory.basic(),
                PhotoFactory.basic()
            ]);

            return users.spread(function (user, photo) {
                //Simulate user sharing of photo
                return user.addPhotoShare(photo).then(function () {
                    //Ensure the relationship was successful
                    return user.getPhotoShares().then(function (photos) {
                        photos.should.match(Array).and.have.length(1);
                        photos[0].id.should.match(photo.id);
                    });
                });
            });
        });
    });

    describe('feedItems', function () {
        it('allows creation of feed item', function () {
            var users = q.all([
                UserFactory.basic(),
                PhotoFactory.basic()
            ]);

            return users.spread(function (user, photo) {
                //Add photo to user's feed
                return user.addFeedItem(photo).then(function () {
                    //Ensure the relationship was successful
                    return user.getFeedItems().then(function (photos) {
                        photos.should.match(Array).and.have.length(1);
                        photos[0].id.should.match(photo.id);
                    });
                });
            });
        });
    });

    describe('doesFollow', function () {
        it('indicates when a user is followed', function () {
            //Create test users
            return q.all([UserFactory.basic(), UserFactory.basic()]).spread(function (user, followee) {
                //Make user follow the followee
                return user.addFollower(followee).then(function (followee) {
                    //Ensure function works correctly
                    return user.doesFollow(followee).then(function (followed) {
                        followed.should.equal(true);
                    });
                });
            });
        });

        it('indicates when a user is not followed', function () {
            //Create test users
            return q.all([UserFactory.basic(), UserFactory.basic()]).spread(function (user, followee) {
                //Make user follow itself, but not the followee
                return user.setFollowers([user]).then(function () {
                    //Ensure function works correctly
                    return user.doesFollow(followee).then(function (followed) {
                        followed.should.equal(false);
                    });
                });
            });
        });

        it('ignores other follower/followee relationships', function () {
            //Create test users
            return q.all([UserFactory.basic(), UserFactory.basic(), UserFactory.basic()]).spread(function (user, otherUser, followee) {
                //Make user follow the followee
                return user.addFollower(otherUser).then(function () {
                    //Ensure function works correctly
                    return user.doesFollow(followee).then(function (followed) {
                        followed.should.equal(false);
                    });
                });
            });
        });
    });
});