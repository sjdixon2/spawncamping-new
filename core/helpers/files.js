/**
 * Retrieves the file extension of a given file name
 * @param filename The file name to parse from
 * @returns {string|null} the file extension, or null
 * @example 'my-image.png' => 'png'
 */
exports.getExtension = function (filename) {
    var ext = filename.split('.');
    return ext[ext.length - 1];
}