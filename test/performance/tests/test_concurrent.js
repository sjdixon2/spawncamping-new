var runSet = testHelpers.runSet;

describe('concurrency performance tests', function () {
    it('Performs a basic concurrent performance test', function () {
        return runSet.byConcurrentSessions(4, function () {
            //Replace this entire function with the scenario to perform
            return 1;
        })
            .then(function (results) {
                //Do stuff with the results here
                console.log(results);
            });
    });
});