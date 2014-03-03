/**
 * Created by hhrosvick on 01/03/14.
 */
var UserFactory = Factories.user;
describe('users routes', function(){

    describe('new', function(){
        it("renders correctly", function(done) {
            server.get("/sessions/new")
                .expect(200, done);
        });
    });

    before(function(done){
        UserFactory.basic().done(done);
    })

    describe('create', function(){
        it("creates a user", function(done) {
            var data = {
                fullname: "Test User",
                username: "users_create@email.com",
                password: "123456"
            };

            server.post("/users/create")
                .type("application/json")
                .send(data)
                .end(function(err, res){

                    db.User.find({
                        where: { email: "users_create@email.com"}
                    }).then(function(user){
                            if(user) user.destroy();
                    });

                    server.get("/feed")
                        .set("cookie", res.header["set-cookie"])
                        .expect(200, done);
                });
        });

        it("reject a duplicate user", function(done) {
            var data = {
                fullname: "Test User",
                username: "user"+(UserFactory.counter() - 1)+"@email.com",
                password: "123456"
            };

            server.post("/users/create")
                .type("application/json")
                .send(data)
                .end(function(err, res){
                    server.get("/feed")
                        .set("cookie", res.header["set-cookie"])
                        .expect(302, done);
                });
        });
    });
});