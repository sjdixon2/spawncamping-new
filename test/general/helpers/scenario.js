/**
 * Created by stephen on 14/03/14.
 */


// This is the actual test run by concurrent and follower tests.

exports.login = function(user, session){
    return session.post('/sessions/create')
        .send({username: user.email, password: 'test'})
        .expect(302)
        .expect('location', '/feed');
};

exports.captureMetrics = function(context){
    context['final'] = new Date();
    console.log(JSON.stringify(context));
    return context;
};

exports.logout = function(user, session){
    return session.get("/sessions/destroy")
        .send()
        .expect(200)
        .expect('location', '/sessions/new');
};

exports.runScenario = function(user){
    console.log(user);
    var context = {
        user: user,
        initial : new Date()
    };
    var session = new Session();
    var promise = q.fcall(exports.login(user, session))
        .then(exports.logout(user, session))
        .then(exports.captureMetrics(context))
        .done();

    return context;
};
