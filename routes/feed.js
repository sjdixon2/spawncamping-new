var url = require('url');

exports.index = function(req, res){
    var offset = helpers.pages.getPageNumber(url.parse(req.url).query);
    var pageSize = helpers.pages.getPageSize();
    var testQuery = "select * from Photoes";
    var query = 'select * from Photoes as P inner join userFeedItems as F where F.UserId=' + req.session.user_id;
    query += ' order by P.createdAt ASC';
    //query += ' limit ' + pageSize + ' offset ' + offset * pageSize;
    console.log(query);
    sequelize.query(testQuery)
    .success(function (photos){
            if(!photos){
                // no photos in list
                console.log("Empty list");
            }

            res.render("feed", {
                title: 'Feed',
                photos: photos
            });
            console.log('\n' + JSON.stringify(photos));
    });
}