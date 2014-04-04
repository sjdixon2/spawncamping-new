var url = require('url');
var cache = global.cache;

exports.index = function (req, res) {
    var page = helpers.pages.getPageNumber(req);
    var offset = page !== 0 ? page - 1 : 0;
    var pageSize = helpers.pages.PAGE_SIZE;
    var testQuery = 'select * from Photoes';
    var query = 'select P.*, U.fullName from Photoes as P inner join UserFeedItems as F on P.id=F.PhotoId ';
    query += 'inner join Users as U on P.userID=U.id ';
    query += 'where F.UserId=';
    query += req.session.login.id || -1;
    query += ' order by P.createdAt DESC';
    query += ' limit ' + pageSize + ' offset ' + offset * pageSize;

    var cacheKey = '' + req.session.login.id + page;
    var cachedPhotos = cache.get(cacheKey);
    if (!cachedPhotos){
        sequelize.query(query)
            .complete(function (err, photos) {
                if (err) {
                    console.log('error: ' + err);
                    return;
                }
                if (!photos) {
                    // no photos in list
                    return;
                }
                console.log('++ caching photos: ' + photos);
                cache.put(cacheKey, photos, 1500);
                var options = {
                    title: 'Feed',
                    photos: photos,
                    prevPage: page != 1 ? page - 1 : 1,
                    nextPage: page + 1,
                    isDone: photos.length < pageSize
                };
                res.render('feed', options);
            });
    }
    else {
        console.log('++ found cached photos: ' + cachedPhotos);
        var options = {
            title: 'Feed',
            photos: cachedPhotos,
            prevPage: page != 1 ? page - 1 : 1,
            nextPage: page + 1,
            isDone: cachedPhotos.length < pageSize
        };
        res.render('feed', options);
    }
};