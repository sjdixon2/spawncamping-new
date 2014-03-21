var uploadFixtures = require('../fixtures/bulkUpload/index'),
    request = require('./request'),
    chance = new Chance(),
    performance = system.performance;

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
 * Populates the performance DB with the given users and
 * photo streams. See project spec for exact details
 *
 * @param users the users to create
 * @param streams the streams to create
 * @returns {promise} promise containing created users, resolved
 *          after DB is populated
 */
exports.$populate = function (users, streams) {
    var self = this;

    //Clear existing DB
    return self.clearAll().then(function () {
        var usersCreated = 0;
        //Chunk users into smaller groups (avoid request timeouts)
        return q.successive(users.chunk(performance.tests.userCreationChunkSize), function (userSet) {
            //Upload test users
            return self.createUsers(userSet)
                .then(function () {
                    usersCreated += userSet.length;
                    console.log(usersCreated + ' of ' + users.length + ' users created...');
                });
        })
            .then(function () {
                //Upload create photos
                return self.createPhotos(streams).then(function () {
                    return users;
                });
            });
    });
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
    var imagePath = system.performance.pathTo('test/general/fixtures/bulkUpload/image.png');

    //Generate users to create
    var users = _.map(numUsers.timesPlusOne(), function (i) {
        return {name: chance.name(), password: chance.string(), id: i, follows: i.timesPlusOne()};
    });

    //Generate photos to create
    var streams = _.map(users, function (user) {
        return {id: user.id, user_id: user.id, path: imagePath, timestamp: chance.date({year:2013})};
    });

    //Populate DB with generated users & streams
    return this.$populate(users, streams);
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
        streams = uploadFixtures.streams;

    //Populate DB with seed users & streams
    return this.$populate(users, streams);
};