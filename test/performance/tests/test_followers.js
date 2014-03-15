var runSet = testHelpers.runSet;

describe('followers performance tests', function () {
    it('Performs a basic followers performance test', function () {
        return runSet.byNumFollowers(7, {step: 2}, function (follower) {
            //Replace this entire function with the scenario to perform
            return follower;
        })
            .then(function (results) {
                //Do stuff with the results here
                console.log(results);
            });
    });
});