var runSet = testHelpers.runSet,
    scenario = testHelpers.scenario;

describe('Response Time due to Number of Concurrent Sessions', function () {

    it('Varies due to scaling number of concurrent sessions', function () {
        return runSet.byConcurrentSessions(100, scenario.runScenario)
            .then(function (results) {
                console.log(results);
            });
    });
});