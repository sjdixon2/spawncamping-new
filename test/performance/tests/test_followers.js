var runSet = testHelpers.runSet;
var scenario = testHelpers.scenario;
var reporter = testHelpers.reporter;


describe('followers performance tests', function () {
    it('Performs a basic followers performance test', function () {
        return runSet.byNumFollowers(7, {step: 2}, scenario.runScenario)
            .then(reporter.print_results);
    });
});