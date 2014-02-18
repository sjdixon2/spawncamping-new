module.exports = function(sequelize, DataTypes) {
    var Photo = sequelize.define('Photo', {
        imagePath: DataTypes.STRING,
        thumbnailPath: DataTypes.STRING,
        description: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                Photo.belongsTo(models.User)
            }
        }
    })

    return Photo;
}