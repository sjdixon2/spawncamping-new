exports.index = function(req, res){
    db.Photo.findAll({
        where: {
            'user.followees.id' : req.session.login
        },
        include: [
            {model: db.User, include :
                [{model: db.User, as: 'Followees'}]
            }
        ]
    }).success(function (photos){
            res.render("feed", {
                title: 'Feed',
                photos: photos
            });
            console.log('\n' + JSON.stringify(photos));
    });
}
