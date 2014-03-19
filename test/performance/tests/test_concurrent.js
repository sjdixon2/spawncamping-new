var runSet = testHelpers.runSet;
var scenario = testHelpers.scenario;
var reporter = testHelpers.reporter;

describe('Response Time due to Number of Concurrent Sessions', function () {
    it('Varies due to scaling number of concurrent sessions', function () {
        return runSet.byConcurrentSessions(4, scenario.runScenario)
            .then(reporter.print_results);
    });
});