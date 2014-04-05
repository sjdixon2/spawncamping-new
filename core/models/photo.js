var cache = global.cache;
module.exports = function (sequelize, DataTypes) {
    var Photo = sequelize.define('Photo', {

        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        extension: DataTypes.STRING,
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
            setOriginalPath : function(path){
                this.originalPath = path;
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
                //Set cached paths to photos
                self.extension = helpers.files.getExtension(originalFilename);

                return this.save().then(function (photo) {
                    photo.setImageUpload(imageUpload);
                    photo.setOriginalPath(self.originalPath);
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
                var cacheKey = user.id+'followers';
                var cachedFollowers = cache.get(cacheKey);
                if(!cachedFollowers){
                    return user.getFollowers().then(function (followers) {
                        cache.put(cacheKey, followers);
                        return self.setFeedItems(followers);
                    });
                }
                else {
                    return self.setFeedItems(cachedFollowers);
                }
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
                console.log('PU processing: this.id=' + id);
                if (!id) {
                    throw new Error('Invalid call - ID must be set');
                }
                if (!photo) {
                    throw new Error('Invalid call - setImageUpload() must be called');
                }
                var user = global.cache.get(self.userID);
                if(!user){
                    global.pxlog('PX ++miss:' + self.userID);
                    return db.User.find(self.userID).then(function (user) {
                        return q.all([
                            self.createImageVersions(photo.path), //Create image versions
                            user.sharePhoto(self),//Share photo to user's followers
                            global.cache.put(self.userID, user)
                        ]);
                    });
                }
                else {
                    global.pxlog('PX hit user:' + self.userID);
                    return q.all([
                        self.createImageVersions(photo.path), //Create image versions
                        user.sharePhoto(self),//Share photo to user's followers
                    ]);
                }
            },
            createImageVersions: function (path) {
                //Read contents of temp file
                //TODO avoid redundant file writing
                // (Express writes temp file, then it's read here, then it's written to a different location)
                var self = this,
                    photo = this._photoUpload;
                global.pxlog('PX path: ' +  path + ' selfID: ' + self.id);
                return q.nfcall(fs.readFile, path).then(function (buffer) {

                    //Get dimensions of image
                    //TODO get dimensions from buffer, not file (faster)
                    return q.nfcall(sizeOf, path).then(function (dimensions) {

                        var savePath = global.system.pathTo(global.settings.UPLOADS_PATH)
                            + '/' + self.id + '.' + self.extension;
                        global.pxlog('PX path2: ' +  savePath + ' selfID:' + self.id);

                        //Write uploaded file to desired location(s) on disk
                        return q.all([
                            self.$writeImageBuffer(savePath, buffer), //Write original file to uploads location
                            self.$writeThumbnailBuffer(savePath, buffer, dimensions) //Write thumbnail image
                        ]);
                    });
                });
            },
            /**
             * Writes the given image buffer to the location
             * of the original image path with the given file name
             * @param savePath the name of the file to write
             * @param buffer the image buffer
             * @returns {promise}
             */
            $writeImageBuffer: function (savePath, buffer) {

                var basename = savePath.match(/\w*[.]\w*$/);
                var uploadPath = global.system.pathTo(global.settings.UPLOADS_PATH) + '/' + basename;
                global.pxlog('PX bufferwrite: ' + uploadPath);
                return q.nfcall(fs.writeFile, uploadPath, basename, buffer);
            },
            /**
             * Resizes and writes the given image buffer to the location
             * of the thumbnail image path with the given file name
             * @param savePath the name of the file to write
             * @param buffer the image buffer
             * @returns {promise}
             */
            $writeThumbnailBuffer: function (savePath, buffer, dimensions) {
                var basename = savePath.match(/\w*[.]\w*$/);
                var image = gm(buffer),
                    defer = q.defer(), //Had to user defer, as gm.write acts weird with promises
                    thumbnailPath = system.pathTo(settings.UPLOADS_PATH) + '/thumbnail/' + basename,
                    thumbnailWidth = 400,
                    thumbnailHeight = thumbnailWidth * dimensions.height / dimensions.width,
                    resizedImage = image.resize(thumbnailWidth, thumbnailHeight, '!');

                global.pxlog('PX thumbnailPath: ' + thumbnailPath);
                resizedImage.write(thumbnailPath, function (err) {
                    if (err){
                        global.pxlog('PX error');
                        defer.reject(err);
                    }
                    global.cache.put(savePath, resizedImage);
                    global.pxlog('PX cached ' + savePath);
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
