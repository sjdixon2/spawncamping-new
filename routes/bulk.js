/**
 * Authenticates admin user for bulk upload functions
 * @param req the given request
 * @param res the given response
 * @param cb function called if/when authorization is completed successfully
 */
var authenticateAdmin = function (req, res, cb) {
    if (req.param('password') == settings.ADMIN_PASSWORD) {
        cb();
    }
    else {
        helpers.routes.unauthorized(res);
    }
};

/**
 * Deletes all items in database, as specified in the project documentation
 */
exports.clear = function (req, res) {
    authenticateAdmin(req, res, function () { //Authenticate admin user
        helpers.system.reset().then(function () {
            helpers.routes.success(res, 'DB cleared');
        });
    });
};

/**
 * Bulk uploads the given users, as specified in the project documentation
 */
exports.users = function (req, res) {
    authenticateAdmin(req, res, function () { //Authenticate admin user
        var users = req.body; //Array of users given by caller

        //Change name of user hash to fullName for user object
        users.each(function (user) {
            user.fullName = user.name; //name = fullName in DB
        });

        //Create all users according to has
        db.User.bulkCreate(users).then(function (userObjs) {
            //Create all follower/followee relationships
            //First, create a hash table of each user created and the followers to be created
            var userSets = {};
            userObjs.each(function (user, index) {
                user.follows = users[index].follows; //Link each follows array to each user (temporarily)
                userSets[user.id] = user;
            });

            //Next, create relationships
            var promise = q.map(userSets, function (user) {
                //Relate each 'follows' user to this user
                return q.map(user.follows, function (followsID) {
                    return user.addFollowee(userSets[followsID]);
                });
            });

            //Indicate success after everything is done
            promise.then(function () {
                helpers.routes.success(res);
            });
        });
    });
};

/**
 * Bulk uploads the given photos, as specified in the project documentation
 */
exports.streams = function (req, res) {
    authenticateAdmin(req, res, function () { //Authenticate admin user
        var photos = req.body;

        //Convert attribute names to DB object names
        photos.each(function (photo) {
            photo.createdAt = new Date(photo.timestamp); //timestamp = createdAt in DB
            photo.userID = photo.user_id; //user_id = userID in DB
        });

        //Create all photos
        q.map(photos, function (photoHash) {
            var photo = db.Photo.build(photoHash);

            //Hack method of simulating image upload
            photo.setPhotoByPath(photoHash.path);

            //Save & create image versions
            return photo.processPhotoUpload();
        })
            //Return success message after all photos are created
            .then(function () {
                helpers.routes.success(res);
            });
    });
};

