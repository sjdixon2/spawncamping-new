var SALT_LENGTH = 10; //Changing this will invalidate any stored passwords.

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        fullName: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {msg: "Name cannot be blank."}
            }
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: {msg: "Email must be a valid address (e.g. user@example.com)."}
            }
        },
        password: {
            type: DataTypes.STRING,
            set: function(plaintext) {
                if(plaintext.length == 0) throw new Error("Password cannot be blank.");
                var hash = bcrypt.hashSync(plaintext, SALT_LENGTH);
                this.setDataValue('password', hash);
            }
        }
    }, {
        classMethods: {
            associate: function(models) {
                //Followers/followee relationship
                User.hasMany(models.User, {through: 'userHasFollowers', as: 'Followers', foreignKey: 'followeesID'});
                User.hasMany(models.User, {through: 'userHasFollowers', as: 'Followees', foreignKey: 'followersID'});

                //Photo ownership relationship
                User.hasMany(models.Photo);

                //User photo share relationship
                User.hasMany(models.Photo, {through: 'userPhotoShares', as: 'photoShares'});

                //User feed entry relationship
                User.hasMany(models.Photo, {through: 'userFeedItems', as: 'feedItems'});
            },

            /*
                Checks an email and password for a matching user
                Returns a promise.
             */
            login: function(email, plaintext) {

                return this.find({
                    where: {
                        email: email
                    }
                }).then(function(user) {
                    if(!user || !bcrypt.compareSync(plaintext, user.password)){
                        throw new Error('Email and/or Password are incorrect.');
                    }
                    return user;
                });
            },
            /**
             * Checks if the given 2 users are the same
             * @param user1 the first user
             * @param user2 the second user
             */
            same: function (user1, user2) {
                //Note: does not check if users are user objects
                return user1.id == user2.id && user1.id != null;
            }
        },
        instanceMethods: {
            /**
             * Shares the given photo with all followers of a user
             * @param photo the photo to share
             * @returns {promise} promise indicate when sharing is complete
             */
            sharePhoto: function (photo) {
                var self = this;
                return self.addPhotoShare(photo).then(function () {
                    return photo.notifyFollowers(self);
                });
            }
        }
    });

    return User;
};