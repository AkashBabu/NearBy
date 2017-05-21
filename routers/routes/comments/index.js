var commentCrud = {
    create: (require("./create")),
    get: (require("./get")),
}

var CommentCrud = new Crud(commentCrud); // CRUD is defined by 'server-helper' lib

var router = require("express").Router()

router.use(CommentCrud)

module.exports = router;