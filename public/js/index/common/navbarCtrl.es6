module.exports = function(app) {
    app.controller("navbarCtrl", ["$window", '$location', "$resource", 'storageService', function($window, $location, $resource, storageService) {
        var vm = this;

        vm.logout = function() {
            $resource("/logout").get(function() { // Clear the session 
                $window.location.href = "/portal/login" // Navigate to login page
            }, function() {
                console.log('Failed to Logout')
            })
        }

        // Switches between the views in circular order
        vm.prevView = function() {
            var currView = $location.path()
            var index = storageService.routes.indexOf(currView)
            if (index == -1) { // Choose 1st view by default
                index = 0
            } else {
                if (index > 0) {
                    index--;
                } else {
                    index = storageService.routes.length - 1;
                }
            }

            $location.path(storageService.routes[index])
        }
    }])
}