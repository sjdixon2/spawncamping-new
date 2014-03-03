exports.index = function(req, res){
    res.status(200).render("feed");
}

exports.userFeed = function(req, res){
    // redirect to login page if not logged in.

    // else, return feed
    res.send("Got feed.")
}
