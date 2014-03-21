/**
 * Maps a set of promises into one promise. Used in the
 * same way as _.map
 * @returns {promise}
 */
q.map = function (arr, func) {
    return q.all(_.map(arr, func));
};

/**
 * Successively calls the given function for each
 * item in the given list. The call for a given item
 * will occur AFTER the returned promise of each
 * previous item is resolved.
 *
 * In other words, it chains a set promises to occur
 * successively after each other
 *
 * @param arr The array of items to call for
 * @param func The function to be called for each item
 *      - should return a promise
 * @return An array of all objects created by promises
 */
q.successive = function (arr, func) {
    var promiseChain = q(),
        promiseSet = [];

    //Iterate over each item in the array
    _.each(arr, function (item, i) {
        var args = arguments;
        //After the previous promise is complete, call this one
        promiseChain = promiseChain.then(function () {
            promiseSet.push(func.apply(null, args)); //Call the given function
        });
    });

    return promiseChain.then(function () {
        return q.all(promiseSet); //After everything is done, return the array of objects returned
    });
};