/**
 * Created by hhrosvick on 01/03/14.
 */

exports.encrypt = function(password) {

    // TODO Need to encrypt this still.
    return password;

};

exports.validate = function(body){

    var email = body.username,
        password = exports.encrypt(body.password),
        deferred = q.defer();

    db.User.find({
        where: { email: email }
    }).complete(function (err, user) {

            if(err) {
                console.log(err);
                deferred.reject(500, '500 - Database Error!');
            } else if(!user || user.password != password) {
                deferred.reject(302, 'Email and/or Password is incorrect.');
            } else {
                deferred.resolve(user);
            }
     });

    return deferred.promise;
};

exports.validateAndCreate = function(body){

    var name = body.fullname,
        email = body.username,
        password = exports.encrypt(body.password),
        deferred = q.defer();

    db.User.find({
        where: { email: email }
    }).complete(function (err, user) {

        if(err) {
            console.log(err);
            deferred.reject(500, '500 - Database Error!');
        } else if(user) {
            deferred.reject(302, 'User already exists!');
        } else {

            db.User.create({
                email: email,
                password: password,
                fullname: name
            }).done(function(user){
                deferred.resolve(user);
            });
        }
    });

    return deferred.promise;
};
