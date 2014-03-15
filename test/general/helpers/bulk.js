var uploadFixtures = require('../fixtures/bulkUpload/index'),
    request = require('./request');

/**
 * Clears the performance server's DB
 * @returns {promise}
 */
exports.clearAll = function () {
    var url = system.performance.getUrlPath('/bulk/clear', {password: settings.ADMIN_PASSWORD});

    return request.doRequest('get', [url]);
};

/**
 * Creates the given users in the performance server's DB
 * @param users The users to create (see project spec)
 * @returns {promise}
 */
exports.createUsers = function (users) {
    var url = system.performance.getUrlPath('/bulk/users', {password: settings.ADMIN_PASSWORD});

    return request.doRequest('post', [url, users, {json: true, timeout: 120000}]);
};

/**
 * Creates the given photos in the performance server's DB
 * @param photos The photos to create (see project spec)
 * @returns {promise}
 */
exports.createPhotos = function (photos) {
    var url = system.performance.getUrlPath('/bulk/streams', {password: settings.ADMIN_PASSWORD});

    return request.doRequest('post', [url, photos, {json: true, timeout: 120000}]);
};

/**
 * Clears the database of the performance server, then
 * creates the specified number of followers
 * @param numUsers the number of followers to create.
 *      Each user x will have x followers, being users 1 to x
 *
 *  @example
 *  generateFollowers(3) => Database will have the following users:
 *      [
 *          {id: 1, followers: [1]},
 *          {id: 2, followers: [1, 2]},
 *          {id: 3, followers: [1, 2, 3]}
 *      ]
 *
 *  @return {promise} Promise containing all users created (in JSON form), resolved
 *          after transaction is complete
 */
exports.generateUsersAndFollowers = function (numUsers) {
    return q(); //TODO
};

/**
 * Clears the database of the performance server, then fills it with
 * the generic data defined in fixtures/bulkUpload/index.js
 *
 * @returns {promise} Promise containing the seed data created (as JS object),
 *      resolved when upload is complete
 */
exports.bySeed = function () {
    var users = uploadFixtures.users,
        streams = uploadFixtures.streams,
        self = this;

    //Clear existing DB
    return self.clearAll().then(function () {
        //Upload test users
        return self.createUsers(users).then(function () {
            //Upload create photos
            return self.createPhotos(streams).then(function () {
                return users;
            });
        });
    });
};