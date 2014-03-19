Array.prototype.contains = function (obj) {
    return this.indexOf(obj) >= 0;
};

/**
 * Run a callback for each item in array
 * @param func
 * @returns {*}
 */
Array.prototype.each = function (func) {
    return _.each(this, func);
};

Array.prototype.isEmpty = function () {
    return this.length === 0;
};