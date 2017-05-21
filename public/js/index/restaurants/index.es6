module.exports = function(app) {
    require("./restaurantCtrl")(app)
    require("./commentService")(app)
}