var UserFactory = require('./user');

exports.basic = function () {
    return UserFactory.basic().then(function (user) {
        return db.Photo.create({
            description: 'test description',
            imagePath: 'TODO',
            thumbnailPath: 'TODO',
            userID: user.id
        })
            .fail(function (err) {
                console.log(err);
            });
    });
}