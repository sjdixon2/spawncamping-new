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
}