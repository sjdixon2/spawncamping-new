var bulkUpload = require('./bulkUpload');

/**
 * Runs a performance test comparing the number of followers
 * against the response time of the system.
 *
 * @param {number} numUsers The number of followers to generate
 * @param {function} scenario The function to run for an individual follower
 *          @return promise Promise with the results of the scenario, resolving
 *              after the scenario is complete
 * @param {object} options
 *      step: Run performance test on each nth element
 *
 * @returns {promise} Promise with an array of all results generated in scenario
 */
exports.byNumFollowers = function (numUsers, scenario, options) {
    //Set default options
    options = _.extend({
        step: 1
    }, options);

    //Generate the specified number of users
    return bulkUpload.generateUsersAndFollowers(numUsers)
        .then(function (followers) {
            //Get every nth element to test
            var followersToTest = _.filter(followers, function (follower) {
                return follower.id % options.step == 0;
            });

            //Run test on each follower successively after one another
            return q.successive(followersToTest, function (follower) {
                return scenario(follower); //Call individual scenario
            });
        });
};

/**
 * Runs a performance test with several concurrent sessions. Each
 * session runs an instance of the given scenario
 * @param numSessions The number of sessions to run concurrently
 * @param scenario {function} The function to run for an individual session
 */
exports.byConcurrentSessions = function (numSessions, scenario) {
    return bulkUpload.bySeed().then(function (seed) {
        return _.times(numSessions, function () {
            return scenario(); //Call individual scenario
        });
    });
};