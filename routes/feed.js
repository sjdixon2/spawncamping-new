exports.index = function(req, res){
    res.send("/feed: feed.index")
}

exports.userFeed = function(req, res){
    // redirect to login page if not logged in.

    // else, return feed
    res.send("Got feed.")
}
