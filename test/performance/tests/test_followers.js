var runSet = testHelpers.runSet;
var scenario = testHelpers.scenario;
var reporter = testHelpers.reporter;


describe('Response Time By Number of Followers', function () {
    it('Varies By Number of Followers', function () {
        return runSet.byNumFollowers(7, {step: 2}, scenario.runScenario)
            .then(reporter.print_results);
    });
});