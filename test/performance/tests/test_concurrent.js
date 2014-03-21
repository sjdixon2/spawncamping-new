var runSet = testHelpers.runSet,
    scenario = testHelpers.scenario,
    reporter = testHelpers.reporter,
    performance = system.performance;

describe('Response Time due to Number of Concurrent Sessions', function () {
    if (performance.tests.concurrency.runTest) {
        it('Varies due to scaling number of concurrent sessions', function () {
            return runSet.byConcurrentSessions(performance.tests.concurrency.options, scenario.runScenario)
                .then(reporter.exportConcurrencyResults);
        });
    }
});