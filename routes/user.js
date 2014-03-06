
exports.signupForm = function (req, res) {
    res.render('signup', {
        title: 'Sign Up'
    });
};

exports.register = function (req, res) {
    // register new user in database
    req.session.login = null;
    var attrs = {
            email: req.body.username,
            password: req.body.password,
            fullName: req.body.fullname
        },
        errors,
        user;

    // This section may need additional refactoring.
    try{
        user = db.User.build(attrs);
        errors = user.validate();
    }catch(err) {// Catches the error in User -> password -> set
        errors = { password: [err.message] };
        attrs.password = "notblank";
        // Run validations for other fields.
        extend(errors, db.User.build(attrs).validate());
    }

    if(!errors) {
        db.User.find({where:{email: user.email}}).success(function(duplicate){
            if(duplicate){
                req.flash('errors', {duplicate: ['Email is already in use.']});
                res.redirect("/users/new");
            } else {
                user.save().then(function (){
                    req.session.login = user;
                    res.redirect("/feed");
                });
            }
        });
    } else {
        req.flash('errors', errors);
        res.redirect("/users/new");
    }
};

exports.stream = function(req, res) {
    // get user stream

    var page = (req.query.page ? req.query.page : 1);
    var options = {
            where: {userID: req.params.id},
            offset: (page - 1) * helpers.pages.PAGE_SIZE,
            limit: helpers.pages.PAGE_SIZE,
            order: 'createdAt ASC'
        };

    db.User.find({
        where: {
            id: req.params.id
        }
    }).then(function (user){
        db.Photo.findAll(options).then(function(photos){

            photos.forEach(function(photo){
                photo.fromNow = moment(photo.createdAt).fromNow();
            })

            res.render("stream", {
                photos: photos,
                nextPage: (photos.length >= helpers.pages.PAGE_SIZE) ? page + 1 : 0,
                prevPage: page - 1,
                streamuser: user
            });
        });
    });
};

exports.follow = function(req, res){
    // follow user stream with :id

    // follower id
    var user1 = req.session.login;
    // followee id
    var user2 = req.params.id;
    console.log('follower: '+user1);
    console.log('followee: '+user2);

    user1.addFollower(user2);

    //redirect
    res.send("following user "+user1+"'s stream");
};

exports.unfollow = function(req, res){
    res.send("unfollowing :id stream");

    var user1 = req.session.login;
    // followee id
    var user2 = req.params.id;
    console.log('follower: '+user1);
    console.log('followee: '+user2);

    user1.removeFollower(user2);
};

exports.share = function(req, res) {


};

