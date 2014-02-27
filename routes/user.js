/*
 * GET users listing.
 */

exports.list = function (req, res) {
    // demo
    res.render('login');
};

exports.signupForm = function (req, res) {
    // send new user form
	res.send("User signup form");
};

exports.register = function (req, res) {
    // register new user in database
    res.send("User registered.");
};

exports.stream = function(req, res) {
    // get user stream
    res.send("sent photo stream for user :id");
};

exports.follow = function(req, res){
    // follow user stream with :id
    res.send("following :id stream");
};

exports.unfollow = function(req, res){
    res.send("unfollowing :id stream");
};

