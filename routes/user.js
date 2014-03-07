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
                user.save().then(function(){
                    user.addFollowee(user).then(function (){
                        req.session.login = user;
                        res.redirect("/feed");
                    });
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

        user.getFollowers(helpers.routes.getUser(req)).then(function(follows){
            var followed = (follows.length > 0);
            user.getPhotoShares({
                offset: (page - 1) * helpers.pages.PAGE_SIZE,
                limit: helpers.pages.PAGE_SIZE,
                order: 'createdAt ASC'
            }).then(function(photos){
                    res.render("stream", {
                        headTitle: user.fullName + "'s Stream",
                        photos: photos,
                        nextPage: (photos.length >= helpers.pages.PAGE_SIZE) ? page + 1 : 0,
                        prevPage: page - 1,
                        streamuser: user,
                        followed: followed
                    });
                });
        });
    });
};

exports.follow = function (req, res) {
    var followeeID = req.params.id;
    var user = helpers.routes.getUser(req);

    //Get followee
    db.User.find(followeeID).then(function (followee) {
        //Create relationship
        user.addFollowee(followee).then(function () {
            res.redirect('/users/' + followeeID);
        });
    });
};

exports.unfollow = function(req, res){
    var followeeID = req.params.id;
    var user = helpers.routes.getUser(req);

    //Get followee
    db.User.find(followeeID).then(function (followee) {
        //Create relationship
        user.removeFollowee(followee).then(function () {
            res.redirect('/users/' + followeeID);
        });
    });
};

exports.share = function(req, res) {
    var picture = req.params.photo;
    var user = helpers.routes.getUser(req);

    db.Photo.find(picture).then(function(photo){
        user.addPhotoShare(photo).then(function () {
            res.redirect('/user/' + user);

            var query = "insert into userFeedItems (createdAt, updatedAt, PhotoId, UserId) ";
            query += "select now(), now(), " + photo.id + ", " +
                "FollowersId from userHasFollowers where followeesID=" + user.id;
            console.log(query);
            sequelize.query(query).complete(function (err){
                if(err){
                    console.log("error: " + err);
                }
            });
        });
    });
};

