var performance = system.performance;

function arrayToCSVFile (arr, path) {
    var data = csv().from.array(arr);
    return data.to.stream(fs.createWriteStream(path));
}

exports.exportNumFollowersResults = function(results){
    var csvPath = system.pathTo(performance.RESULTS_DIR, 'performance-followers.csv');

    //Convert to results to CSV table
    var csvResults = [['Request Number', 'Completion Time']].concat(_.map(results, function (result) {
        return [result.requestNo, result.time];
    }));

    //Ensure results folder exists
    return fs.makeIfExists(performance.RESULTS_DIR).then(function () {
        //Write array to file
        arrayToCSVFile(csvResults, csvPath);
        console.log('results written to ' + csvPath);
    });
}

exports.exportConcurrencyResults = function(results){
    var csvPath = system.pathTo(performance.RESULTS_DIR, 'performance-concurrency.csv');

    //Convert to results to CSV table
    var csvResults = [['# Concurrent Requests', 'Mean Completion Time']].concat(_.map(results, function (resultSet) {
        var meanReply = _.reduce(resultSet, function(mem, obj) {
            return mem + obj.time;
        }, 0) / resultSet.length || 0;

        return [resultSet.length, meanReply];
    }));

    //Ensure results folder exists
    return fs.makeIfExists(performance.RESULTS_DIR).then(function () {
        //Write array to file
        arrayToCSVFile(csvResults, csvPath);
        console.log('results written to ' + csvPath);
    });
}