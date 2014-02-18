var counter = 1;

exports.basic = function () {
    return db.User.create({
        email: 'user' + counter++ + '@email.com',
        password: '123456',
        fullname: 'Test User'
    });
}