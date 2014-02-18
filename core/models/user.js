module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        fullName: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING
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
            }
        }
    });

    return User;
};