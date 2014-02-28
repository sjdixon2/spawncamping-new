/*
 GET login page
 */
exports.loginForm = function (req, res) {
    if(req.session.login) {
        res.redirect('/');
    } else {
        var redirect = "/";
        if(req.param('redirect')) redirect = req.param('redirect');
        res.render('login', {
            title: 'Login',
            redirect: redirect
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

    db.User.find({
        where: { email: req.body.username }
    }).complete(function (err, user) {

            var redirect = req.body.redirect;
            if(!redirect) redirect = '/';

            if(err) {
                // TODO change to 500 error function
                console.log(err);
                res.statusCode = 500;
                res.render('login', {
                    title: 'Login',
                    redirect: redirect,
                    err: '500 - Error accessing database!'
                });
            } else if (!user || user.password != req.body.password) {
                console.log("Login attempt: " + req.body.username);
                res.statusCode = 403;
                res.render('login', {
                    title: 'Login',
                    redirect: redirect,
                    err: 'Email and/or Password  is incorrect.'
                });
            } else {
                req.session.login = user.id;
                res.render('login-success', {
                    redirect: redirect
                });
            }

        });

};