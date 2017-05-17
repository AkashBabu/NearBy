var router = require("express").Router();
var fs = require('fs')
var path = require("path")

var viewsDir = path.resolve("views")

router.get("/:level1", function(req, res) {
    var relFile = req.params.level1 + ".html"
    var absFile = path.join(viewsDir, relFile)
    testLog.log("ReqFile:", relFile);
    testLog.log("absFile:", absFile)

    if(fs.existsSync(absFile)) {
        res.render(relFile);
    } else {
        res.render("pageNotFound.html")
    }
})

router.get("/:level1/:level2", function(req, res) {
    var relFile = req.params.level1 + "/" +  req.params.level2 + ".html"
     var absFile = path.join(viewsDir, relFile)
    if(fs.existsSync(absFile)) {
        res.render(relFile);
    } else {
        res.render("pageNotFound.html")
    }
})

module.exports = router;