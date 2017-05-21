var chai = require('chai')
var should = chai.should()

chai.use(require("chai-http"));

var agent = chai.request.agent(require("../server"))

var path = require("path")
global.config = require("../config/config")
config.app.viewsDir = path.resolve("views")
var viewsDir = config.app.viewsDir

var db = require("mongojs")(config.db.mongo.urls[config.env])

var regUser = {
    name: 'test',
    email: 'test@mail.com',
    pwd: "test"
}


describe("#Portal", () => {
    before((done) => {
        // Clear database
        // Agent Register
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

    it("should return required html file from views/ folder GET /portal/index", (done) => {
        agent.get("/portal/index")
            .end((err, res) => {
                res.should.have.status(200)
                res.headers['content-type'].should.be.eql("text/html; charset=utf-8")

                res.text.should.be.eql(require('fs').readFileSync(config.app.viewsDir + "/index.html", 'utf-8'));

                done()
            })
    })
    it("should return page from second level in views/ folder GET /portal/home/map", (done) => {
        agent.get("/portal/home/map")
            .end((err, res) => {
                res.should.have.status(200)
                res.headers['content-type'].should.be.eql("text/html; charset=utf-8")

                res.text.should.be.eql(require('fs').readFileSync(viewsDir + "/home/map.html", 'utf-8'))

                done()
            })
    })
    it("should return pageNotFound.html if the request file is not found", (done) => {
        agent.get("/portal/sdf")
            .end((err, res) => {
                res.should.have.status(200)
                res.headers['content-type'].should.be.eql("text/html; charset=utf-8")

                res.text.should.be.eql(require('fs').readFileSync(viewsDir + "/pageNotFound.html", 'utf-8'))

                done()
            })
    })
})