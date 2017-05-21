module.exports = function(app) {
    app.factory("commentService", ['$resource', function($resource) {
        return $resource("/api/comments/:restaurantId")
    }])
}