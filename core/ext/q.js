/**
 * Maps a set of promises into one promise. Used in the
 * same way as _.map
 * @returns {promise}
 */
q.map = function (arr, func) {
    return q.all(_.map(arr, func));
};