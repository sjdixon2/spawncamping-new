var runSet = testHelpers.runSet;
var scenario = testHelpers.scenario;
var reporter = testHelpers.reporter;


describe('Response Time By Number of Followers', function () {
    it('Varies By Number of Followers', function () {
        return runSet.byNumFollowers(100, {step: 20}, scenario.runScenario)
            .then(function (results) {
                console.log(results);
            });
    });
});