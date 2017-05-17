import * as angular from "angular"

// require("../css/login.css")
// var angular = require('angular')
var app = angular.module('app', [])
app.run(() => {
    console.log('Angular App is running')
})

require("./bands")(app)