var runSet = testHelpers.runSet,
    scenario = testHelpers.scenario,
    reporter = testHelpers.reporter;


describe('Response Time By Number of Followers', function () {
    it('Varies By Number of Followers', function () {
        return runSet.byNumFollowers(10, {step: 2}, scenario.runScenario)
            .then(reporter.exportNumFollowersResults);
    });
});