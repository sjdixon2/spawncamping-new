
exports.signupForm = function (req, res) {
    res.render('signup', {
        title: 'Sign Up'
    });
};

exports.register = function (req, res) {
    // register new user in database
    req.session.login = null;
    helpers.login.validateAndCreate(req.body)
        .then(function(new_user){
            req.session.login = new_user.id;
            res.redirect("/feed");

        }, function(error){
            req.flash('errors', error.message);
            res.redirect(error.code, "/users/new");
        });
};

exports.stream = function(req, res) {
    // get user stream
    res.send("sent photo stream for user :id");
};

exports.follow = function(req, res){
    // follow user stream with :id

    // follower id
    var user1 = req.session.login;
    // followee id
    var user2 = req.params.id;
    console.log('follower: '+user1);
    console.log('followee: '+user2);

    user1.addFollower(user2);

    //redirect
    res.send("following user "+user1+"'s stream");
};

exports.unfollow = function(req, res){
    res.send("unfollowing :id stream");

    var user1 = req.session.login;
    // followee id
    var user2 = req.params.id;
    console.log('follower: '+user1);
    console.log('followee: '+user2);

    user1.removeFollower(user2);
};

exports.share = function(req, res) {


};

