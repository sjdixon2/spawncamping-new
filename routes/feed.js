exports.index = function(req, res){
    db.Photo.findAll({
        where : { id : { ne: 0}}
    }).success(function (photos){
            res.render("feed", {
                title: 'Feed',
                photos: photos
            });
    });
}
