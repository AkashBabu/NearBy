
global.config =require('./config')
global.mongoConfig = require('./config.mongo')

var mongo = require('mongojs')
global.db = mongo(config.db.mongo.urls[config.env])

global.async = require('async')

var Logger = require('logger-switch')
global.testLog = new Logger('Test')
global.genLog = new Logger('Gen')
global.errLog = new Logger('Err')

if(config.env == 'DEV' || config.env == 'TEST') {
    testLog.activate()
    genLog.activate()
    errLog.activate()

    testLog.timestamp("D_MMM_YY h:mma")
    genLog.timestamp("D_MMM_YY h:mma")
    errLog.timestamp("D_MMM_YY h:mma")
} else {
    testLog.deactivate()
    genLog.activate()
    errLog.activate()
}