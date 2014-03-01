module.exports = function(sequelize, DataTypes) {
    var Photo = sequelize.define('Photo', {
        imagePath: DataTypes.STRING,
        thumbnailPath: DataTypes.STRING,
        description: DataTypes.STRING,
        createdAt: { //Manual version of createdAt (see 'timestamps' below)
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false, //Photos cannot have true timestamps (otherwise createdAt can't be set, as required by bulk photo upload)
        classMethods: {
            associate: function(models) {
                //Photo ownership relationship
                Photo.belongsTo(models.User);

                //User photo share relationship
                Photo.hasMany(models.User, {through: 'userPhotoShares', as: 'userShares'});

                //User feed entry relationship
                Photo.hasMany(models.User, {through: 'userFeedItems', as: 'feedItems'});
            }
        }
    });

    return Photo;
};