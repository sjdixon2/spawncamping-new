
exports.newPhotoForm = function(req, res){
    // html displaying upload form
    res.send("html displaying upload form.")
}

exports.upload = function(req, res){
    // multipart form data including the photo
    res.send("upload the photo");
}

exports.thumbnail = function(req, res){
    res.send("sent thumbnail :id with ext :ext");
}

exports.photo = function(req, res){
    res.send("sent photo :id with ext :ext");
}
