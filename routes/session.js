/*
 GET login page
 */
exports.loginForm = function (req, res) {
    if(req.session.login){
        res.redirect("/");
    }
    else {
        res.render('login', {
                title: 'Login'
        })
    };

};

/*
 logout (destroy session)
 */
exports.destroy = function (req, res) {
    req.session.login = null;
    res.redirect('/');
};

/*
 POST login page (for user authentication)
 */
exports.attemptLogin = function (req, res) {
    helpers.login.validate(req.body).then(function(user){
            req.session.login = user;
            req.session.user_id = user.id;
            res.redirect("/feed");

        }, function(error){
            req.flash('errors', error.message);
            res.redirect(error.code, "/sessions/new");
        });

};