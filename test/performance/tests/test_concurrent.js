var runSet = testHelpers.runSet;
var scenario = testHelpers.scenario;

describe('concurrency performance tests', function () {
    it('Performs a basic concurrent performance test', function () {
        return runSet.byConcurrentSessions(4, scenario.runScenario)
            .then(function (results) {
                //Do stuff with the results here
                console.log(results);
            });
    });
});