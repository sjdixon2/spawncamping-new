exports.index = function(req, res){
    db.Photo.findAll({
    }).success(function (photos){
            res.render("feed", {
                title: 'Feed',
                photos: photos
            });
    });
}
