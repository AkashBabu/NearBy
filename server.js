require('./config/init.global')

var express =  require('express')
var app = express();

var path = require('path')
var bodyParser = require("body-parser")
var logger = require('morgan')
var fs = require('fs')
var rotateFileStream = require("rotating-file-stream")

var port = config.app.ports[config.env]

var apiLogDir = path.join(__dirname, "api-logs")
fs.existsSync(apiLogDir) || fs.mkdirSync(apiLogDir)

var accessLogger = rotateFileStream('access.log', {
    interval: '1d',
    path: apiLogDir
})

app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.engine('html', require('ejs').renderFile)

app.use(logger("dev", {stream: accessLogger}))
app.use(logger("dev"))
app.use("/dist", express.static(path.join(__dirname, "dist")))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))




app.use("/api", require("./routers/api"))
app.use("/portal", require("./routers/portal"))

// Not Found
app.use(function(req, res) {
    res.status(404).send("Page Not Found")
})

// Error Handler
app.use(function(err, req, res, next) {
    errLog.error("SERVER_ERR:", err)
    res.status(500).send("Internal Server Error")
})

// Start Server
app.listen(port, (err) => {
    if(err) errLog.error("FAILED TO START SERVER:", err)
    else genLog.log('NearBy Server Running on Port:', port);
})

module.exports = app