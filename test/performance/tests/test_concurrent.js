var runSet = testHelpers.runSet,
    scenario = testHelpers.scenario,
    reporter = testHelpers.reporter;

describe('Response Time due to Number of Concurrent Sessions', function () {

    it('Varies due to scaling number of concurrent sessions', function () {
        return runSet.byConcurrentSessions(10, {step: 2}, scenario.runScenario)
            .then(reporter.exportConcurrencyResults);
    });
});