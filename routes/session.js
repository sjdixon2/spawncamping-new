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

    db.User.login(req.body.username, req.body.password)
        .then(function(user){
                req.session.login = user;
                res.redirect("/feed");
            }, function(reason) {
                req.flash('errors', {login: [reason.message]});
                res.redirect('/sessions/new');
            })
        .catch(function (err) {
            console.log(err);
            req.flash('errors', {serverError: ['Server Error! Please contact an administrator.']});
            res.redirect(500, '/sessions/new');
        });
};