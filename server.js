require('./config/init.globals'); // Initialises all the global variables

var express = require('express')
var middlewares = require('./lib/middlewares') // Middlewares for sessions
var cookieParser = require('cookie-parser')

var path = require('path')
var bodyParser = require("body-parser")

var logger = require('morgan')

var port = config.app.ports[config.env]
var whiteList = ['/portal/login']

var app = express();

app.disable("x-powered-by");
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.engine('html', require('ejs').renderFile)

app.use("/dist", express.static(path.join(__dirname, "dist")))
app.use("/public", express.static(path.join(__dirname, "public")));

// File logging for PROD and console logging for TEST&DEV
var loggerFormat = ':remote-addr - [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms'
if (config.env == "DEV" || config.env == 'TEST') {
    app.use(logger('dev'))
} else {

    var fs = require('fs')
    var rotateFileStream = require("rotating-file-stream")
    var apiLogDir = path.join(__dirname, "api-logs")
    fs.existsSync(apiLogDir) || fs.mkdirSync(apiLogDir)
    var accessLogger = rotateFileStream('access.log', {
        size: '1M',
        interval: '1m',
        path: apiLogDir,
        compress: 'gzip'
    })

    app.use(logger(loggerFormat, { stream: accessLogger }))
}

// Use session only after serving static files
app.use(cookieParser(config.app.token.cookie.secret))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


// app.use(/^\/(.*)/, function(req, res, next) {
//         testLog.log('path:', req.path)
//         testLog.log('path:', req.params)
//         next();
//     })
// Middlewares for Creating and validating JWT Tokens
app.post('/login', middlewares.loginUser())
app.post('/register', middlewares.registerUser())
app.get("/logout", middlewares.logout())
app.use(function(req, res, next) {
    if (whiteList.indexOf(req.path) > -1) {
        next()
    } else if (req.urlRedirect) {
        req.urlRedirect = false;
        next()
    } else {
        middlewares.validateToken(req, res, next)
    }
})

app.use("/api", require("./routers/api"))
app.use("/portal", require("./routers/portal"))

// Not Found
app.use(function(req, res) {
    // res.status(404).send("Page Not Found")
    res.redirect("/portal/index")
})

// Error Handler
app.use(function(err, req, res, next) {
    errLog.error("SERVER_ERR:", err)
    res.status(500).send("Internal Server Error")
})

// Start Server
app.listen(port, (err) => {
    if (err) errLog.error("FAILED TO START SERVER:", err)
    else genLog.log('NearBy Server Running on Port:', port);
})

if (config.env == "PROD") {
    process.on("uncaughtException", (err) => {
        errLog.error('Uncaught Exception:', err)
    })
}

module.exports = app