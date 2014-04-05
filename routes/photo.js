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
//    var form = new formidable.IncomingForm({
//        uploadDir: global.system.pathTo('public/uploads'),
//        keepExtensions: true
//    });
//
//    console.log(form.uploadDir);
//
//    form.parse(req, function(err, fields, files){
//        if (err){
//            req.flash('errors', err);
//            return res.render('/photo/new');
//        }
//        console.log(files.image);
//    });
//
//    var buffer = new Buffer();
//
//    form.on('data', function(chunk){
//        console.log("received chunk + " chunk);
//        buffer.
//
//    })
//
//    form.on('progress', function(bytesReceived, bytesExpected) {
//        console.log(bytesReceived + ' ' + bytesExpected);
//    });
//
//    form.on('error', function(err) {
//        req.flash('errors', errors);
//        res.redirect('/photos/new');
//    });
//
//    return form.on('done', function(){
//        console.log('done');
//        res.render('/feed');
//    });
    var attrs = req.body,
        image = req.files.image;
    var form = new global.formidable.IncomingForm();
    form.uploadDir = global.system.pathTo('public/tmp');

    var photo = db.Photo.build(attrs);
    photo.userID = req.session.login.id; //Attach current user to uploaded photo
    photo.setImageUpload(image); //Attach uploaded file to photo

    var errors = photo.validate();
    if (!errors) { //If no errors, then save
        photo.uploadSave().then(function(){
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
