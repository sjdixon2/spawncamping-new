
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
    res.send("following :id stream");
};

exports.unfollow = function(req, res){
    res.send("unfollowing :id stream");
};

