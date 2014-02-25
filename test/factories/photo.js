exports.basic = function () {
    return db.Photo.create({
        description: 'test description',
        imagePath: 'TODO',
        thumbnailPath: 'TODO'
    });
}