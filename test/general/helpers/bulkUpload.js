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
 * @returns {promise} Promise containing the seed data created (as JS object),
 *      resolved when upload is complete
 */
exports.bySeed = function () {
    return q(); //TODO
};