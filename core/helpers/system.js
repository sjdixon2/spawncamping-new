/**
 * Adds photo upload directories, if they don't already exist
 * @return {Promise} a promise indicating the completion of folder creation
 */
exports.createImageUploadDirectories = function () {
    //Create root uploads directory
    return q.nfcall(fs.mkdir, system.pathTo(settings.UPLOADS_PATH))
        //Create directories inside root directory
        .then(function () {
            return q.all(
                //Create thumbnails directory
                q.nfcall(fs.mkdir, system.pathTo(settings.UPLOADS_PATH, '/thumbnail'))
            );
        });
};

/**
 * Resets the entire system to its initial state. This
 * includes deleting all items in the database, deleting
 * all photos in the file system, etc.
 *
 * @return {promise} promise indicating that reset is complete
 */
exports.reset = function () {
    //Delete all entries in all tables
    return q.all([
        //Delete regular tables
        q.map(db, function (model) {
            if (model.destroy) {
                return model.destroy();
            }
        }),
        //Delete implicit relationship data - MUST BE DONE FOR ALL M:N TABLES
        sequelize.query('DELETE FROM UserHasFollowers WHERE 1'),
        sequelize.query('DELETE FROM UserPhotoShares WHERE 1'),
        sequelize.query('DELETE FROM UserFeedItems WHERE 1')
    ]);
};