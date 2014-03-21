var bulk = require('./bulk');

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
exports.byNumFollowers = function (numUsers, options, scenario) {
    //Set default options
    options = _.extend({
        step: 1
    }, options);

    console.log('Beginning performance test. Seeding database, this may take a while...');

    //Generate the specified number of users
    return bulk.generateUsersAndFollowers(numUsers).then(function (followers) {
        console.log('Seed complete. Beginning performance test...');

        //Get every nth element to test
        var followersToTest = _.where(followers, function (follower) {
            return (follower.id - 1) % options.step === 0;
        });

        //Run test on each follower successively after one another
        return q.successive(followersToTest, function (follower, i) {
            console.log('Running test for follower #' + follower.id);
            return scenario(follower, i); //Call individual scenario
        });
    });
};

/**
 * Runs a performance test with several concurrent sessions. Each
 * session runs an instance of the given scenario
 *
 * @param maxSessions The max number of sessions to run concurrently
 * @param {object} options
 *      step: Run performance test on each nth element
 * @param scenario {function} The function to run for an individual session
 */
exports.byConcurrentSessions = function (maxSessions, options, scenario) {
    //Set default options
    options = _.extend({
        step: 1
    }, options);

    console.log('Beginning performance test. Seeding database...');

    return bulk.bySeed().then(function (followers) {
        console.log('Seed complete. Beginning performance test...');

        //Get the set of number of sessions to run
        var sessionsToRun = _.where(maxSessions.times(), function (num) {
            return num % options.step === 0;
        });

        //Run each concurrency test after another
        return q.successive(sessionsToRun, function (numSessions) {
            console.log('Running ' + numSessions + ' concurrent sessions');

            var userToTest = _.max(followers, function (follower) {
                return follower.id;
            });
            return q.map(numSessions.times(), function (i) {
                return scenario(userToTest, i);
            });
        });
    });
};