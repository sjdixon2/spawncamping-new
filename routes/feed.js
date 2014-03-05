exports.index = function(req, res){
    db.Photo.findAll({
        //limit: 30,
        //offset: 0,
        where: {
            'feedItems.id' : req.session.user_id
        },
        include: [
            {model: db.User, as: 'feedItems'}
        ],
        order: 'createdAt ASC'

    }).success(function (photos){
            res.render("feed", {
                title: 'Feed',
                photos: photos
            });
            console.log('\n' + JSON.stringify(photos));
    });
}