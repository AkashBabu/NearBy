var router = require("express").Router();
var fs = require('fs')
var path = require("path")

var viewsDir = __dirname + "/../views/";

/**
 * This router serves pages from views folder.
 * So the path for the views/index.html file should be /portal/index
 *      --> for views/home/map.html should be /portal/home/map
 */
router.get(/^\/(.*)/, function(req, res) {
    var relFile = req.params[0] + ".html";
    var absFile = path.join(viewsDir, relFile)
        // testLog.log('absfile:', absFile);

    fs.stat(absFile, (err, stats) => {
        if (!err && stats.isFile()) {
            res.render(relFile)
        } else {
            res.render("pageNotFound.html");
        }
    })
})

module.exports = router;