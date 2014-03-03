/**
 * Created by hhrosvick on 01/03/14.
 */
var UserFactory = Factories.user;
describe('sessions routes', function () {

    before(function(done){
        //Ensure at least one user.
        UserFactory.basic().done(done);
    })

    describe('new', function(){
        it("renders correctly", function (done) {
            server.get("/sessions/new")
                .expect(200, done);
        });
    });

    describe('create', function(){

        it("allows a valid login", function (done) {
            var data = {
                username: "user"+(UserFactory.counter() - 1)+"@email.com",
                password: "123456"
            };

            server.post("/sessions/create")
                .type("application/json")
                .send(data)
                .end(function(err, res){
                    server.get("/feed")
                        .set("cookie", res.header["set-cookie"])
                        .expect(200, done);
                });
        });
        it("rejects an invalid login", function (done) {
            var data = {
                username: "not-a-valid-user",
                password: ""
            };

            server.post("/sessions/create")
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