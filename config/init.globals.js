// Most frequently used libraries in files

var path = require("path")
global.config = require("./config")
global.mongoConfig = require("./config.mongo")

require("../lib/db/mongoConn")
require("../lib/logger")

var serverHelper = require('server-helper')
var Helper = serverHelper.Helper
var HelperMongo = serverHelper.HelperMongo
var HelperResp = serverHelper.HelperResp
var HelperValidate = serverHelper.HelperValidate
var HelperTransform = serverHelper.HelperTransform

if (config.env == 'DEV' || config.env == 'PROD') {
    global.helper = new Helper(true)
    global.helperMongo = new HelperMongo(config.db.mongo.urls[config.env], true)
    global.helperResp = new HelperResp(true)
    global.helperValidate = new HelperValidate(true)
    global.helperTransform = new HelperTransform(true)
    global.Crud = serverHelper.Crud

} else {
    global.helper = new Helper(false)
    global.helperMongo = new HelperMongo(config.db.mongo.urls[config.env], false)
    global.helperResp = new HelperResp(false)
    global.helperValidate = new HelperValidate(false)
    global.helperTransform = new HelperTransform(false)
    global.Crud = serverHelper.Crud
}

global.async = require("async")