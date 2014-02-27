var main = require('./'),
    user = require('./user'),
    session = require("./session"),
    photo = require('./photo'),
    feed = require("./feed");

//app.get('/', main.index);
app.get("/", feed.index);
app.get('/users', user.list);
app.get("/users/new", user.signupForm);
//app.get("/users/:id", user.stream);
//app.get("/users/:id/follow", user.follow)
//app.get("/users/:id/unfollow", user.unfollow)
app.post("/users/create", user.register);

app.get("/sessions/new", session.loginForm);
app.post("/sessions/create", session.attemptLogin);


app.get("/feed", feed.index);

app.get("/photos/new", photo.newPhotoForm);
app.post("/photos/create", photo.upload);

