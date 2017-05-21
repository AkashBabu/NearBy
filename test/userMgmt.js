var chai = require('chai')
var should = chai.should()

chai.use(require("chai-http"));
var request = chai.request(require("../server"))

var config = require("../config/config")
var db = require("mongojs")(config.db.mongo.urls[config.env])

var regUser = {
    name: 'test',
    email: 'test@mail.com',
    pwd: "test"
}
var logUser = {
    email: regUser.email,
    pwd: regUser.pwd
}

describe("#User Management", () => {
    before((done) => {
        // Clear database
        db.dropDatabase(done)
    })

    after((done) => {
        // Drop database
        db.dropDatabase(done)
    })

    it("should be able to register a User POST /register", (done) => {
        request.post("/register")
            .send(regUser)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.an("object")
                res.body.error.should.not.be.ok;
                res.body.data.should.be.an("object")
                res.body.data.user.should.be.an("object")
                res.body.data.user.name.should.be.eql(regUser.name)

                res.should.have.cookie("token")

                done()
            })
    })
    it("should return error if insufficient information is supplied POST /register", (done) => {
        var regUserPart = {
            name: 'test2',
            email: 'test2@mail.com'
        }

        request.post("/register")
            .send(regUserPart)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.an("object")
                res.body.error.should.be.ok;
                res.body.data.should.be.eql("Missing Fields")

                done()
            })
    })
    it("should return error for create a user with duplicate Email POST /register", (done) => {
        request.post("/register")
            .send(regUser)
            .end((err, res) => {
                res.should.have.status(400)
                res.body.should.be.an("object")
                res.body.error.should.be.ok;
                res.body.data.should.be.eql("Email ID Has already been registered")

                done();
            })
    })
    it("should be able to login with the registered user POST /login", (done) => {
        request.post("/login")
            .send(logUser)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an("object")
                res.body.error.should.not.be.ok;
                res.body.data.should.be.an("object")
                res.body.data.user.should.be.an("object")
                res.body.data.user.email.should.be.eql(logUser.email)

                res.should.have.cookie("token")

                done()
            })
    })
    it("should treat email as case insensitive POST /login", (done) => {
        var logUserCI = {
            email: logUser.email.toUpperCase(),
            pwd: logUser.pwd
        }
        request.post("/login")
            .send(logUserCI)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an("object")
                res.body.error.should.not.be.ok;
                res.body.data.should.be.an("object")
                res.body.data.user.should.be.an("object")
                res.body.data.user.email.should.be.eql(logUser.email)

                done()
            })
    })
    it("should return error if the credentails dont match", (done) => {
        var invalidUser = {
            email: logUser.email,
            pwd: 'asdf'
        }
        request.post("/login")
            .send(invalidUser)
            .end((err, res) => {
                res.should.have.status(401)
                res.body.should.be.an("object")
                res.body.error.should.be.ok;
                res.body.data.should.be.eql("Invalid Email or Password")

                done()
            })
    })
    it("should logout GET /logout", (done) => {
        var agent = chai.request.agent(require("../server"))

        agent.post("/login")
            .send(logUser)
            .end((err, res) => {
                res.should.have.status(200)
                res.should.have.cookie("token")

                request.get("/logout")
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.not.have.cookie("token")

                        done()
                    })
            })
    })
})