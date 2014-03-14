var UserFactory = require('./user');

/**
 * Creates a standard photo
 * @param options custom attributes of the created photo
 * @returns {promise} promise returning the created photo
 */
exports.basic = function (options) {
    return UserFactory.basic().then(function (user) {
        options = extend({
            description: 'test description',
            imagePath: 'TODO',
            thumbnailPath: 'TODO',
            userID: user.id
        }, options);

        return db.Photo.create(options);
    });
}