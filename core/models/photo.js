module.exports = function (sequelize, DataTypes) {
    var Photo = sequelize.define('Photo', {
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
                Photo.hasMany(models.User, {through: 'userPhotoShares', as: 'userShares'});

                //User feed entry relationship
                Photo.hasMany(models.User, {through: 'userFeedItems', as: 'feedItems'});
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
                }
            },
            /**
             * Saves the image, then creates image versions
             */
            uploadSave: function () {
                var imageUpload = this._photoUpload;
                return this.save().then(function (photo) {
                    photo.setImageUpload(imageUpload);
                    return photo.processPhotoUpload();
                });
            },


            /*
             Adds the photo to the feeds of everyone subscribing to the user who uploaded the photo

             */
            notifyFollowers: function(userId, photoId){
                console.log(userId + ' ' + photoId);
                if (!userId) {
                    throw new Error('Invalid call - ID must be set');
                }
                if (!photoId) {
                    throw new Error('Invalid call - setImageUpload() must be called');
                }
                // For each follower following the uploader
                console.log("notifying followers");
                var query = "insert into userFeedItems (createdAt, updatedAt, PhotoId, UserId) ";
                query += "select now(), now(), " + photoId + ", " +
                    "FollowersId from userHasFollowers where followeesID=" + userId;
                console.log(query);
                sequelize.query(query).complete(function (err){
                    if(err){
                        console.log("error: " + err);
                    }
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
                if (!id) {
                    throw new Error('Invalid call - ID must be set');
                }
                if (!photo) {
                    throw new Error('Invalid call - setImageUpload() must be called');
                }

                //Read contents of temp file
                //TODO avoid redundant file writing (Express writes temp file, then it's read here, then it's written to a different location)
                return q.nfcall(fs.readFile, photo.path).then(function (buffer) {
                    var fileName = id + '.' + helpers.files.getExtension(photo.originalFilename), //The name of the file to be written
                        uploadsPath = settings.UPLOADS_PATH, //The relative directory to where uploads are stored
                        uploadsURL = settings.UPLOADS_URL_PATH,
                        thumbnailBuffer = self.createThumbnail(buffer);

                    //Set cached paths to photos
                    self.imagePath = uploadsURL + fileName;
                    self.thumbnailPath = uploadsURL + 'thumbnail/' + fileName;

                    //Write uploaded file to desired location(s) on disk
                    return q.all([
                        self.save(), //Save updated paths to DB
                        q.nfcall(fs.writeFile, system.pathTo(uploadsPath, fileName), buffer), //Write original file to uploads location
                        q.nfcall(fs.writeFile, system.pathTo(uploadsPath, 'thumbnail/', fileName), thumbnailBuffer) //Write thumbnail image
                    ]);
                }).then(this.notifyFollowers(this.userID, this.id));
            },
            /**
             * Creates a thumbnail buffer from the given image buffer
             * @param buffer the buffer of the image to convert
             * @returns {buffer} a buffer of the thumbnail image
             */
            createThumbnail: function (buffer) {
                //TODO create thumbnail buffer with gm
                return buffer;
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