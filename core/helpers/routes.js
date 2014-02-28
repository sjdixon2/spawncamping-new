
/*
Checks for user authentication.

Used by adding this function (helpers.routes.check_auth) as a middleware to any app.get or app.post.
e.g. app.get('/feed', helpers.routes.check_auth, feed.index)
Should be used on all routes that require authentication.
 */
exports.check_auth = function(req, res, next) {

    if(!req.session.login) {
        res.statusCode = 403;
        res.render('login', {
            title: 'Login',
            redirect: req.url,
            err: 'Please login to access the requested page.'
        });
        return;
    }
    next();
};

/**
 * Renders basic success message indicating that the route
 * was completed successfully
 * @param res route's response
 * @param body message in body (optional)
 */
exports.success = function (res, body) {
    res.send(200, body);
};