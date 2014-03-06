/**
 * Simulates a user login for testing purposes
 * @param session the (supertest-session) session to simulate for
 * @return {Promise} a promise resolved after user login
 */
exports.login = function (session) {
    var defer = q.defer();

    Factories.user.basic().then(function (user) {
        session.post('/sessions/create')
            .send({username: user.email, password: Factories.user.password})
            .expect(302)
            .expect('location', '/feed', defer.makeNodeResolver());
    });

    return defer.promise;
}