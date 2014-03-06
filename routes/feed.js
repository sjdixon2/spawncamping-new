var url = require('url');

exports.index = function(req, res){
    var offset = helpers.pages.getItemOffset(req);
    var pageSize = helpers.pages.PAGE_SIZE;
    var testQuery = "select * from Photoes";
    var query = 'select * from Photoes as P inner join userFeedItems as F on P.id=F.PhotoId where F.UserId=';
    query += req.session.user_id || -1;
    query += ' order by P.createdAt ASC';
    query += ' limit ' + pageSize + ' offset ' + offset * pageSize;
    console.log(query);
    sequelize.query(query)
    .complete(function (err, photos){
            if(err){
                console.log("error: " + err);
                return;
            }
            if(!photos){
                // no photos in list
                console.log("Empty list");
                return;
            }

            res.render("feed", {
                title: 'Feed',
                photos: photos
            });
            console.log('\n' + JSON.stringify(photos));
    });
}