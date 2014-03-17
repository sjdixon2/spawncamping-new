var runSet = testHelpers.runSet;
var scenario = testHelpers.scenario;
var reporter = testHelpers.reporter;

describe('concurrency performance tests', function () {
    it('Performs a basic concurrent performance test', function () {
        return runSet.byConcurrentSessions(4, scenario.runScenario)
            .then(reporter.print_results);
    });
});