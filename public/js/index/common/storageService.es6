module.exports = function(app) {
    app.factory("storageService", () => {
        function Store() {
            this.restaurants = []; // To exchange restaurants information between map-view and restaurants-view
            this.mapPosition = {}; // To retain the map position when switching between views
            this.routes = ['/map', '/restaurants'] // For going back to prev views
            return this;
        }

        return new Store();
    })
}