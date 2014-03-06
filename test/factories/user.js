var counter = 1;
var PASSWORD = '123456';


exports.basic = function () {
    return db.User.create({
        email: 'user' + counter++ + '@email.com',
        password: PASSWORD,
        fullName: 'Test User'
    });
}

exports.password = PASSWORD;

exports.counter = function(){
    return counter;
}