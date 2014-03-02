var main = require('./'),
    user = require('./user'),
    session = require("./session"),
    photo = require('./photo'),
    feed = require("./feed"),
    bulk = require("./bulk");

//app.get('/', main.index);
app.get("/", feed.index);
app.get("/users/new", user.signupForm);
//app.get("/users/:id", user.stream);
//app.get("/users/:id/follow", user.follow)
//app.get("/users/:id/unfollow", user.unfollow)
app.post("/users/create", user.register);

app.get("/sessions/new", session.loginForm);
app.post("/sessions/create", session.attemptLogin);


app.get("/feed", helpers.routes.check_auth, feed.index);

app.get("/photos/new", photo.new);
app.post("/photos/create", photo.create);


//Bulk upload routes
app.get('/bulk/clear', bulk.clear);
app.post('/bulk/users', bulk.users);
app.post('/bulk/streams', bulk.streams);