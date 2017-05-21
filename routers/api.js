var router = require('express').Router()

router.use("/comments", require("./routes/comments"))

module.exports = router