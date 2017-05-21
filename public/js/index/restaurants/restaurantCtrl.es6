module.exports = function(app) {
    app.controller("restaurantCtrl", ['$mdDialog', '$routeParams', '$timeout', '$location', 'storageService', function($mdDialog, $routeParams, $timeout, $location, storageService) {
        var vm = this;

        vm.restaurants = storageService.restaurants; // Retreive the restaurants found on map

        // If no restaurant are found, then re-route back to map-view
        if (vm.restaurants.length === 0) {
            $location.path("/map");
        }
        vm.selectedRestaurant = {}

        /**
         * Extract img src url from restaurant-info
         */
        vm.getImgSrc = (restaurant) => {
            if (restaurant.photos && restaurant.photos[0]) {
                return restaurant.photos[0].getUrl({ maxWidth: 250, maxHeight: 250 });
            }
            return "";
        }

        /**
         * Pops up a dialog right from the element that was clicked on
         */
        vm.showRestaurantDetails = function(restaurant, index) {
            vm.selectedRestaurant = restaurant;
            $mdDialog.show({
                template: require("html-loader!./restaurant-details.partials.html"),
                controller: restaurantDetailsCtrl,
                controllerAs: 'dm',
                clickOutsideToClose: true,
                openFrom: '#restaurant_overview' + index,
                closeTo: '#restaurant_overview' + index
            })
        }

        /**
         * Finds the matching restaurant for the given id
         * @param {string} restaurantId - matching id to be retrieved
         * @returns {object}
         */
        function getRestaurant(restaurantId) {
            let index = 0;
            let restaurant = null;
            vm.restaurants.some((_restaurant, _index) => {
                if (_restaurant.id == restaurantId) {
                    restaurant = _restaurant;
                    index = _index;
                    return true
                }
                return false;
            })

            return {
                index: index,
                restaurant: restaurant
            }
        }

        $timeout(() => { // Check the location path and pop up the dialog if required.
                if ($routeParams.restaurantId) {
                    let match = getRestaurant($routeParams.restaurantId)
                    vm.showRestaurantDetails(match.restaurant, match.index)
                }
            }, 1000) // This delay is introduced to provide time for view-change animation



        /**
         * Restaurant Details Dialog Controller
         */
        restaurantDetailsCtrl.$inject = ['$mdDialog', '$location', 'commentService']; // To ensure minification safe

        function restaurantDetailsCtrl($mdDialog, $location, commentService) {
            var dm = this;
            dm.restaurant = vm.selectedRestaurant; // Copy the selected restaurant from restaurantCtrl scope --> restaurantDetailsCtrl scope

            (function() {
                let query = { restaurantId: dm.restaurant.id }
                commentService.get(query, function(res) {
                    dm.comments = res.error ? [] : res.data.comments
                })
            }())

            dm.getImgSrc = () => {
                if (dm.restaurant.photos && dm.restaurant.photos[0]) {
                    return dm.restaurant.photos[0].getUrl({ maxWidth: 125, maxHeight: 125 });
                }
                return "";
            }

            dm.submitComments = (myComment) => {
                var comment = {
                    id: dm.restaurant.id,
                    comment: myComment
                }
                commentService.save({}, comment, function(res) {
                    if (res.error) {
                        console.log('Failed to Submit Comments:', res.data)
                    } else {
                        console.log('Successfully submitted comments')
                    }

                    $mdDialog.hide();
                }, function(res) {
                    console.log('Failed to Submit Comments:', res.data)
                    $mdDialog.hide();
                })
            }

            dm.closeDialog = () => {
                $mdDialog.cancel()
            }

            dm.navigateOnMap = function() {
                $mdDialog.hide();
                $location.path("/map/" + dm.restaurant.id);
            }

        }


    }])
}