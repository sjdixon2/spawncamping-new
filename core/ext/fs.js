/**
 * Creates a directory if it doesn't already exist
 * @param path the path to the directory
 * @returns {promise} promise resolved when directory is created
 */
fs.makeIfExists = function (path) {
    var self = this,
        defer = q.defer();
    self.exists(path, function (exists) {
        if (!exists) {
            self.mkdir(path, function (err) {
                if (err) {
                    defer.reject();
                }
                else {
                    defer.resolve();
                }
            });
        }
        else {
            defer.resolve();
        }
    });
    return defer.promise;
};