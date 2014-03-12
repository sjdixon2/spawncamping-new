/**
 * All content disposition types that are considered images
 * @type {Array}
 */
exports.IMAGE_CONTENT_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif'
];

/**
 * Indicates whether the given upload file is an image
 * @param upload the file uploaded
 * @returns {boolean}
 */
exports.isImageUpload = function (upload) {
    return upload && exports.IMAGE_CONTENT_TYPES.contains(upload.type);
};