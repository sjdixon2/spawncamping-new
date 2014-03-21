var runSet = testHelpers.runSet,
    scenario = testHelpers.scenario,
    reporter = testHelpers.reporter,
    performance = system.performance;


describe('Response Time By Number of Followers', function () {
    if(performance.tests.followers.runTest) {
        it('Varies By Number of Followers', function () {
            return runSet.byNumFollowers(performance.tests.followers.options, scenario.runScenario)
                .then(reporter.exportNumFollowersResults);
        });
    }
});