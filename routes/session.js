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
exports.logout = function (req, res) {
    req.session.login = null;
    res.redirect('/');
};

/*
 POST login page (for user authentication)
 */
exports.attemptLogin = function (req, res) {
    helpers.login.validate(req.body).then(function(user){
            req.session.login = user.id;
            res.redirect("/feed");

        }, function(error){
            req.flash('errors', error.message);
            res.redirect(error.code, "/sessions/new");
        });

};