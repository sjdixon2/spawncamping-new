exports.index = function(req, res){
    db.Photo.findAll({
        where: {
            'feedItems.id' : req.session.login
        },
        include: [
            {model: db.User, as: 'feedItems'}
        ],
        order: '`createdAt`ASC'
    }).success(function (photos){
            res.render("feed", {
                title: 'Feed',
                photos: photos
            });
            console.log('\n' + JSON.stringify(photos));
    });
}
