module.exports = function(app) {
    require("./storageService")(app)
    require("./navbarCtrl")(app)
}