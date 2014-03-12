/**
 * Displays HTML page for photo upload
 */
exports.new = function (req, res) {
    // html displaying upload form
    res.render('photos/new', {title: 'Upload Photo'});
};

/**
 * POST handler for photo upload
 */
exports.create = function (req, res) {
    var attrs = req.body,
        image = req.files.image;

    var photo = db.Photo.build(attrs);
    photo.userID = req.session.login.id; //Attach current user to uploaded photo
    photo.setImageUpload(image); //Attach uploaded file to photo

    var errors = photo.validate();
    if (!errors) { //If no errors, then save
        return photo.uploadSave().then(function () {
            //Redirect to main page after complete
            res.redirect('/feed');
        });
    } else { //Otherwise, show errors in new page
        req.flash('errors', errors);
        res.redirect('/photos/new');
    }
};

exports.thumbnail = function(req, res){
    app.use(express.static(settings.UPLOADS_PATH+'/thumbnail'));
};

exports.photo = function(req, res){
    app.use(express.static(settings.UPLOADS_PATH));
};
