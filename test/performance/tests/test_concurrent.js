var runSet = testHelpers.runSet;
var scenario = testHelpers.scenario;
var reporter = testHelpers.reporter;
var promise = require('promises');
var needle = require('needle');
var assert = require('assert');
var bulk = testHelpers.bulk;

describe('Response Time due to Number of Concurrent Sessions', function () {

    function printArguments(err, resp){
        console.log("err:" + err);

        // look at whats inside resp
        var cache = [];
        console.log("resp:" + JSON.stringify(resp, function(key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        }));
        cache = null; // Enable garbage collection
        //done looking
    }

    it('Varies due to scaling number of concurrent sessions', function () {
        return runSet.byConcurrentSessions(1, scenario.runScenario)
            .then(reporter.print_results);
    });

    it("varies using promises only", function(){

    });
});