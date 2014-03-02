/*
 GET login page
 */
exports.loginForm = function (req, res) {
    if(req.session.login) {
        res.redirect('/');
    } else {
        if(!req.session.redirect) req.session.redirect = "/";
        res.render('login', {
            title: 'Login',
            redirect: req.session.redirect,
            err: req.session.err
        })
    }
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

    if(!req.session.redirect) req.session.redirect = '/';
    req.session.err = null;

    helpers.login.validate(req.body).then(function(user){
            req.session.login = user.id;
            res.redirect("/feed");

        }, function(code, message){
            req.session.err = message;
            res.redirect(code, "/sessions/new");
        });

};