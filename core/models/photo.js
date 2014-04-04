module.exports = function (sequelize, DataTypes) {
    var Photo = sequelize.define('Photo', {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        imagePath: {
            type: DataTypes.STRING,
            validate: {
                /**
                 * Validator for uploaded image. Ensures an uploaded file is given,
                 * and the file is a valid image type.
                 */
                uploadValid: function () {
                    //Ensure images are valid
                    var photo = this._photoUpload;
                    if (photo) { //If no photo was attempted to be uploaded, ignore all this
                        if (photo.size <= 0) { //If uploaded was attempted, but no file was given
                            throw new Error('Please specify an image to upload');
                        }
                        if (!helpers.photos.isImageUpload(photo)) { //If file is not an photo
                            throw new Error('File uploaded is not an image!');
                        }
                    }
                }
            }
        },
        thumbnailPath: DataTypes.STRING,
        description: DataTypes.STRING,
        createdAt: { //Manual version of createdAt (see 'timestamps' below)
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        userID: { //Shouldn't be used unless needed (use setUser instead) - used by image bulk upload
            type: DataTypes.INTEGER,
            validate: {
                notNull: true //Photo must have a user
            }
        }
    }, {
        timestamps: false, //Photos cannot have true timestamps (otherwise createdAt can't be set, as required by bulk photo upload)
        classMethods: {
            associate: function (models) {
                //Photo ownership relationship
                Photo.belongsTo(models.User);

                //User photo share relationship
                Photo.hasMany(models.User, {through: 'UserPhotoShares', as: 'userShares'});

                //User feed entry relationship
                Photo.hasMany(models.User, {through: 'UserFeedItems', as: 'feedItems'});
            },
            /**
             * Retrieves the last created photo in the database
             * @returns {Promise} a sequelize promise with the last created photo
             */
            latest: function () {
                return this.find({order: 'createdAt DESC'});
            }
        },
        instanceMethods: {
            /**
             * Sets the photo for this object to the given file upload
             * @param photo the uploaded photo object (as given by express' req.files)
             */
            setImageUpload: function (photo) {
                this._photoUpload = photo; //Used later by validation functions
            },
            /**
             * Simulates image upload for an image already on the computer system
             * @param imagePath the path to the image to be added
             */
            setPhotoByPath: function (imagePath) {
                //Fake attributes of image upload
                var fileName = path.basename(imagePath);
                this._photoUpload = {
                    path: imagePath,
                    originalFilename: fileName,
                    type: 'image/' + helpers.files.getExtension(fileName),
                    size: 1 //Allows validation to pass
                };
            },
            /**
             * Saves the image, then creates image versions
             */
            uploadSave: function () {
                var self = this;
                var imageUpload = this._photoUpload;
                var originalFilename = imageUpload.originalFilename;
                var id = this.id;
                var fileName = id + '.' + helpers.files.getExtension(originalFilename), //The name of the file to be written
                    uploadsURL = global.settings.UPLOADS_URL_PATH;

                //Set cached paths to photos
                self.fileName = fileName;
                self.imagePath = uploadsURL + fileName;
                self.thumbnailPath = uploadsURL + 'thumbnail/' + fileName;

                console.log('PU uploadSave: this.id=' + id + ' and self.imagePath=' + self.imagePath);

                return this.save().then(function (photo) {
                    photo.setImageUpload(imageUpload);
                    return photo.processPhotoUpload();
                });
            },


            /**
             * Adds the photo to the feeds of everyone subscribing to the user who uploaded the photo
             * @param user the user whose followers should be notified
             * @returns {promise} indicates when the adding of followers is complete
             */
            notifyFollowers: function(user){
                var self = this;
                return user.getFollowers().then(function (followers) {
                    return self.setFeedItems(followers);
                });
            },

            /**
             * Processes the uploaded images by creating versions of the given
             * file upload. It will also write the paths to these images to the database.
             *
             * @required IMPORTANT
             *  - The image must have an ID assigned
             *  - @setImageUpload or @setPhotoByPath must be called with a valid image
             *
             * @returns {promise} promise for when image processing is complete
             */
            processPhotoUpload: function () {
                //Ensure pre-requisites are met
                var id = this.id,
                    self = this, //Reference to this photo
                    photo = this._photoUpload; //Get photo ID, either from this object or given photo
                console.log('PU processing: this.id=' + id + ' and self.imagePath=' + self.imagePath);
                if (!id) {
                    throw new Error('Invalid call - ID must be set');
                }
                if (!photo) {
                    throw new Error('Invalid call - setImageUpload() must be called');
                }
                var user = global.cache.get(self.userID);
                if(!user){
                    console.log('++miss:' + self.userID);
                    return db.User.find(self.userID).then(function (user) {
                        return q.all([
                            self.createImageVersions(photo.path), //Create image versions
                            user.sharePhoto(self),//Share photo to user's followers
                            global.cache.put(self.userID, user)
                        ]);
                    });
                }
                else {
                    console.log('++hit:' + self.userID);
                    return q.all([
                        self.createImageVersions(photo.path), //Create image versions
                        user.sharePhoto(self),//Share photo to user's followers
                    ]);
                }
            },
            createImageVersions: function (path) {
                //Read contents of temp file
                //TODO avoid redundant file writing (Express writes temp file, then it's read here, then it's written to a different location)
                var self = this;

                return q.nfcall(fs.readFile, path).then(function (buffer) {

                    //Get dimensions of image
                    //TODO get dimensions from buffer, not file (faster)
                    return q.nfcall(sizeOf, path).then(function (dimensions) {
                        //Write uploaded file to desired location(s) on disk
                        return q.all([
                            self.$writeImageBuffer(self.fileName, buffer), //Write original file to uploads location
                            self.$writeThumbnailBuffer(self.fileName, buffer, dimensions) //Write thumbnail image
                        ]);
                    });
                });
            },
            /**
             * Writes the given image buffer to the location
             * of the original image path with the given file name
             * @param fileName the name of the file to write
             * @param buffer the image buffer
             * @returns {promise}
             */
            $writeImageBuffer: function (fileName, buffer) {
                return q.nfcall(fs.writeFile, system.pathTo(settings.UPLOADS_PATH, fileName), buffer);
            },
            /**
             * Resizes and writes the given image buffer to the location
             * of the thumbnail image path with the given file name
             * @param fileName the name of the file to write
             * @param buffer the image buffer
             * @returns {promise}
             */
            $writeThumbnailBuffer: function (fileName, buffer, dimensions) {
                var image = gm(buffer),
                    defer = q.defer(), //Had to user defer, as gm.write acts weird with promises
                    thumbnailPath = system.pathTo(settings.UPLOADS_PATH, 'thumbnail/', fileName),
                    thumbnailWidth = 400,
                    thumbnailHeight = thumbnailWidth * dimensions.height / dimensions.width,
                    resizedImage = image.resize(thumbnailWidth, thumbnailHeight, '!');

                resizedImage.write(thumbnailPath, function (err) {
                    if (err) defer.reject(err);
                    global.cache.put(fileName, resizedImage);
                    console.log('++ cached ' + fileName);
                    defer.resolve();
                });

                return defer.promise;
            },
            /**
             * Returns the time ago from the current time
             * @example '1 hour ago', 'a moment ago'
             * @returns {string}
             */
            fromNow: function () {
                return moment(this.createdAt).fromNow();
            }
        }
    });

    return Photo;
};
