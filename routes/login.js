/*
GET login page
 */
exports.form = function (req, res) {
    if(req.session.login) {
        res.redirect('/');
    } else {
        res.render('login', {
            title: 'Login',
            redirect: '/'
        })
    }
};

/*
GET logout page
 */
exports.destroy = function (req, res) {
   req.session.login = null;
   res.redirect('/');
};

/*
POST login page (for user authentication)
 */
exports.auth = function (req, res) {

    db.User.find({
        where: { email: req.body.username }
    }).complete(function (err, user) {

        var redirect = req.body.redirect;
        if(!redirect) redirect = '/';

        if(err) {
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
            res.redirect(redirect);
        }

    });

};