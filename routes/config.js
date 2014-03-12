var main = require('./'),
    user = require('./user'),
    session = require('./session'),
    photo = require('./photo'),
    feed = require('./feed'),
    bulk = require('./bulk');

var check_auth = helpers.routes.check_auth;
app.get('/', check_auth, main.index);
app.get('/feed', check_auth, feed.index);

app.locals.moment = require('moment');

// User Creation Routes
app.get('/users/new', user.signupForm);
app.post('/users/create', user.register);

// User Profile Routes
app.get('/users/:id', check_auth, user.stream);
app.get('/users/:id/follow', check_auth, user.follow);
app.get('/users/:id/unfollow', check_auth, user.unfollow);
app.get('/users/:id/share', check_auth, user.share);

// Session Routes
app.get('/sessions/new', session.loginForm);
app.post('/sessions/create', session.attemptLogin);
app.get('/sessions/destroy', check_auth, session.destroy);

// Photo Upload Routes
app.get('/photos/new', check_auth, photo.new);
app.post('/photos/create', check_auth, photo.create);

//Bulk upload routes
app.get('/bulk/clear', bulk.clear);
app.post('/bulk/users', bulk.users);
app.post('/bulk/streams', bulk.streams);

app.use(function(req, res) {
    res.status(404);
    res.render('errors/404', { title:'404: Page not found', error: '404: Page not found', url: req.url });
});

app.use(function(err, req, res, next){
    var statusCode = err.status || 500;
    var statusText = '';
    var errorPage = '';
    var errorDetail = (process.env.NODE_ENV === 'production') ?
        'Sorry about this error'
        : err.stack;


    switch (statusCode) {
        case 400:
            statusText = 'Bad Request';
            break;
        case 401:
            statusText = 'Unauthorized';
            break;
        case 403:
            statusText = 'Forbidden';
            break;
        case 500:
            statusText = 'Internal Server Error';
            break;
    }
    res.status(statusCode);
    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
        console.log(errorDetail);
    }
    errorPage = 'errors/' + statusCode;
    console.log('error found');
    res.render(errorPage, { title: statusCode + ': ' + statusText, error: errorDetail, url: req.url });

});