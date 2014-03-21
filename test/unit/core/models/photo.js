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

    describe('uploadSave', function () {
        it('creates a thumbnail version of the file', function () {
            return PhotoFactory.basic().then(function (photo) {
                photo.setPhotoByPath(system.pathTo('test/unit/fixtures/models/photo/image.png'));

                //Perform image upload
                return photo.uploadSave().then(function () {
                    //Ensure thumbnail was added
                    photo.id.should.be.a.Number;
                    photo.imagePath.should.equal('/photos/' + photo.id + '.png');
                    photo.thumbnailPath.should.equal('/photos/thumbnail/' + photo.id + '.png');
                });
            });
        });

//        it('notifies followers of the photo upload', function (done) {
//            //TODO fix & restore test
//            q.all([
//                    //Create test users
//                    UserFactory.basic(),
//                    UserFactory.basic()
//                ])
//                .spread(function (user, follower) {
//                    //Simulate following of followee
//                    user.addFollower(follower).then(function (follower) {
//                        //Create test photo
//                        PhotoFactory.basic({userID: user.id}).then(function (photo) {
//                            photo.setPhotoByPath(system.pathTo('test/unit/fixtures/models/photo/image.png'));
//
//                            //Perform image upload
//                            photo.uploadSave().then(function () {
//                                //Get followee's feed
//                                follower.getFeedItems().then(function (feedPhotos) {
//                                    feedPhotos.length.should.equal(1, done);
//                                    done();
//                                });
//                            })
//                        });
//                    });
//                });
//        });
    })
    
    // processPhotoUpload UNIT TESTS
    describe('processPhotoUpload', function(){

        // Successfully creates image and thumbnail and write
        //      correct paths to database
        it('creates versions of file upload and writes paths to db',function(){

            return PhotoFactory.basic().then(function (photo) {

                // setup valid pre-requisites
                photo.setImageUpload(this._photoUpload);
                photo.setPhotoByPath(system.pathTo('test/unit/fixtures/models/photo/image.png'));
                photo.processPhotoUpload().then(function(){

                    // Verify valid photo id and self reference
                    photo.id.should.be.a.Number;

                    // Verify that photo paths are correctly added
                    photo.imagePath.should.equal('/photos/' + photo.id + '.png');
                    photo.thumbnailPath.should.equal('/photos/thumbnail/' + photo.id + '.png');

                });

            });

        });

        // Pass a photo with invalid id, throws invalid id
        it('non-valid id',function(){

            return PhotoFactory.basic().then(function (photo) {

                // setup valid pre-requisites
                photo.setImageUpload(this._photoUpload);
                photo.setPhotoByPath(system.pathTo('test/unit/fixtures/models/photo/image.png'));

                // Set photo id to invalid value
                photo.id = null;

                // Call processPhotoUpload
                //  function should throw invalid id error
                photo.processPhotoUpload().should.throw(new Error('Invalid call - ID must be set'));

            });

        });

        // Pass invalid photo, throws invalid photo
        it('invalid image',function(){

            return PhotoFactory.basic().then(function (photo) {
                photo.setImageUpload(this._photoUpload);
                photo.setPhotoByPath(system.pathTo('test/unit/fixtures/models/photo/image.png'));

                // Set photo to invalid
                this.photo = null;

                // Call processPhotoUpload with invalid photo,
                //      should throw Error
                photo.processPhotoUpload().should.throw(Error('Invalid call - setImageUpload() must be called'));

            });

        });

    });
});
