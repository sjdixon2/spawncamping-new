var main = require('./'),
    user = require('./user'),
    session = require("./session"),
    photo = require('./photo'),
    feed = require("./feed"),
    bulk = require("./bulk");

var check_auth = helpers.routes.check_auth;
app.get("/", check_auth, main.index);
app.get("/feed", check_auth, feed.index);

// User Creation Routes
app.get("/users/new", user.signupForm);
app.post("/users/create", user.register);

// User Profile Routes
//app.get("/users/:id", check_auth, user.stream);
//app.get("/users/:id/follow", check_auth, user.follow)
//app.get("/users/:id/unfollow", check_auth, user.unfollow)

// Session Routes
app.get("/sessions/new", session.loginForm);
app.post("/sessions/create", session.attemptLogin);
app.get("/sessions/destroy", check_auth, session.destroy);

// Photo Upload Routes
app.get("/photos/new", check_auth, photo.new);
app.post("/photos/create", check_auth, photo.create);

//Bulk upload routes
app.get('/bulk/clear', bulk.clear);
app.post('/bulk/users', bulk.users);
app.post('/bulk/streams', bulk.streams);

app.use(check_auth, function(req, res, next){
    res.status(404).render('errors/404', {url: req.url})
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.render('errors/500', { error: err });
});