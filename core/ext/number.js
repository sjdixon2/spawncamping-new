/**
 * @example
 * (5).times() => [0,1,2,3,4]
 *
 * @returns {Array}
 */
Number.prototype.times = function () {
    return _.times(this, function (i) {
        return i;
    });
};

/**
 * @example
 * (6).times() => [1,2,3,4,5,6]
 *
 * @returns {Array}
 */
Number.prototype.timesPlusOne = function () {
    return _.map(this.times(), function (i) {
        return i + 1;
    });
};