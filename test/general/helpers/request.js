
/**
 * Performs a get/post request with the given parameters
 * @param type {string} The type of request to perform (likely 'get' or 'post')
 * @param params {array} An array of the parameters passed to needle. See the needle
 *              documentation for more info
 *
 * @example $doRequest('post', ['/p/a/t/h', {param1: 2, param2: 'test'}]);
 *              => does a post request with the body parameters param1, param2
 *
 * @returns {promise} Promise resolved when request is complete, containing
 * response given by server
 */
exports.doRequest = function (type, params) {
    return q.nfapply(needle[type], params)
        .then(function (obj) {
            var response = obj[0];
            if (response.statusCode != 200 && response.statusCode!=302) throw new Error('Server error: ' + response.statusCode + ' ' + JSON.stringify(response.body));
            return response;
        });
};