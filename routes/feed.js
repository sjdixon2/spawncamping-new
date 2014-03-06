var url = require('url');

exports.index = function(req, res){
    var page = helpers.pages.getPageNumber(req);
    var offset = page!=0? page-1: 0;
    var pageSize = helpers.pages.PAGE_SIZE;
    var testQuery = "select * from Photoes";
    var query = 'select * from Photoes as P inner join userFeedItems as F on P.id=F.PhotoId where F.UserId=';
    query += req.session.user_id || -1;
    query += ' order by P.createdAt ASC';
    query += ' limit ' + pageSize + ' offset ' + offset * pageSize;
    console.log(query);
    sequelize.query(query)
    .complete(function (err, photos){
            console.log(offset+ " " + page);
            if(err){
                console.log("error: " + err);
                return;
            }
            if(!photos){
                // no photos in list
                console.log("Empty list");
                return;
            }
            var options = {
                title: 'Feed',
                photos: photos,
                prevPage: page!=1? page-1: 1,
                nextPage: page+1
            };
            res.render("feed", options);
            console.log('\nCurrent Feed:' + JSON.stringify(photos));
    });
}