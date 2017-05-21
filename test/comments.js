var chai = require('chai')
var should = chai.should()

chai.use(require("chai-http"));

var agent = chai.request.agent(require("../server"))

var config = require("../config/config")
var db = require("mongojs")(config.db.mongo.urls[config.env])

var regUser = {
    name: 'test',
    email: 'test@mail.com',
    pwd: "test"
}
var restaurantId = "1234567890asdf"
var comment = {
    id: restaurantId,
    comment: "asdf"
}
describe("#Comments", () => {
    before((done) => {
        // Agent Register
        // Clear database
        db.dropDatabase(function() {
            agent.post("/register")
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
    })

    after((done) => {
        // Drop database

        db.dropDatabase(done)
    })

    it("should create a new comment POST /comments", (done) => {
        agent.post('/api/comments')
            .send(comment)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.an("object")
                res.body.error.should.not.be.ok;
                res.body.data.nModified.should.be.eql(1)

                done()
            })
    })
    it("should return all comments for a restaurant GET /comments/:restaurantId", (done) => {
        agent.get('/api/comments/' + restaurantId)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.an("object")
                res.body.error.should.not.be.ok;
                res.body.data.id.should.be.eql(restaurantId)
                res.body.data.comments.length.should.be.eql(1)
                res.body.data.comments[0].comment.should.be.eql(comment.comment);
                res.body.data.comments[0].name.should.be.eql(regUser.name);

                done()
            })
    })
    it("should update existing comment if present POST /comments", (done) => {
        agent.post('/api/comments')
            .send({
                id: restaurantId,
                comment: "asdfjkl"
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.an("object")
                res.body.error.should.not.be.ok;
                res.body.data.nModified.should.be.eql(1)

                agent.get('/api/comments/' + restaurantId)
                    .end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.be.an("object")
                        res.body.error.should.not.be.ok;
                        res.body.data.id.should.be.eql(restaurantId)
                        res.body.data.comments.length.should.be.eql(1)
                        res.body.data.comments[0].comment.should.be.eql("asdfjkl");
                        res.body.data.comments[0].name.should.be.eql(regUser.name);

                        done()
                    })
            })
    })
    it("should return Method Not Allowed for any other type of requests", (done) => {
        agent.put("/api/comments")
            .end((err, res) => {
                res.should.have.status(405);

                // res.body.should.be.an("object")
                // res.body.error.should.be.ok;

                done()
            })
    })
})