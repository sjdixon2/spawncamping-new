var performance = system.performance,
    dateFormat = 'MM-D:HH:mm:ss';

function arrayToCSVFile (arr, path) {
    var defer = q.defer(),
        data = csv().from.array(arr);
    return data.to.stream(fs.createWriteStream(path))
        .on('close', function () {
            console.log('results written to ' + path);
            defer.resolve();
        });

    return defer.promise;
}

exports.exportNumFollowersResults = function(results){
    var csvPath = system.pathTo(performance.RESULTS_DIR, 'performance-followers-' + moment().format(dateFormat) + '.csv');

    //Convert to results to CSV table
    var csvResults = [['Number of Followers', 'Completion Time']].concat(_.map(results, function (result) {
        return [result.user.follows.length, result.time];
    }));

    //Ensure results folder exists
    return fs.makeIfExists(performance.RESULTS_DIR).then(function () {
        //Write array to file
        return arrayToCSVFile(csvResults, csvPath);
    });
}

exports.exportConcurrencyResults = function(results){
    var csvPath = system.pathTo(performance.RESULTS_DIR, 'performance-concurrency-' + moment().format(dateFormat) + '.csv');

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
        return arrayToCSVFile(csvResults, csvPath);
    });
}