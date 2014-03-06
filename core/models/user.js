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
            }
        }
    });

    return User;
};