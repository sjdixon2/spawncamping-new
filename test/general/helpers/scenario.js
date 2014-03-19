/**
 * Created by stephen on 14/03/14.
 */


// This is the actual test run by concurrent and follower tests.

exports.login = function(context, callback){
    console.log("Login @ " + new Date());
    context['loginTime'] = new Date();
    context['session'].post('/sessions/create')
        .send({username: context['user'].email, password: 'test'})
        .expect(302)
        .expect('location', '/feed');
    return callback(context);
};

exports.captureMetrics = function(context, callback){
    console.log("Capture @ " + new Date());
    context['captured'] = new Date();
    console.log("result: " + JSON.stringify(context));

    return callback(context);
};

exports.logout = function(context, callback){
    console.log("Logout @ " + new Date());
    context['session'].get("/sessions/destroy")
        .send()
        .expect(404)
        .expect('location', '/sessions/new');
    return callback(context);
};

exports.runScenario = function(user){
    var context = {
        user: user,
        initial : new Date(),
        session: new Session()
    };

    return exports.login(context, function(c1){
        return exports.logout(context, function(c2){
            return exports.captureMetrics(context, function(c3){
                console.log("Done callback stack");
                return c3;
            })
        })
    })
};
