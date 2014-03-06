/**
 * Created by stephen on 05/03/14.
 */

exports.PAGE_SIZE = 30;

exports.extractPageNumber = function(query){
    if (!query){
        return 1;
    }
    else {
        var offset = parseInt(query.split('=')[1]);
        console.log('offset=' + offset);
        return offset;
    }
}

exports.getPageNumber = function(req){
    return exports.extractPageNumber(url.parse(req.url).query);
}