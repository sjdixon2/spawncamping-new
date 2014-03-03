var main = require('./'),
    user = require('./user'),
    session = require("./session"),
    photo = require('./photo'),
    feed = require("./feed");

var check_auth = helpers.routes.check_auth;

// User Login & Registration Methods
app.get("/users/new", user.signupForm);
app.post("/users/create",  user.register);

app.get("/", check_auth, feed.index);

//app.get("/users/:id", check_auth, user.stream);
//app.get("/users/:id/follow", check_auth, user.follow)
//app.get("/users/:id/unfollow", check_auth, user.unfollow)

app.get("/sessions/new", check_auth, session.loginForm);
app.post("/sessions/create", check_auth, session.attemptLogin);
app.get("/feed", check_auth, feed.index);
app.get("/photos/new", check_auth, photo.newPhotoForm);
app.post("/photos/create", check_auth, photo.upload);

app.use(function(req, res, next){
    res.status(404).render("404_error_template");
});