module.exports = function(app) {
    app.controller("mapCtrl", ["$scope", '$compile', '$timeout', '$location', '$routeParams', 'storageService', function($scope, $compile, $timeout, $location, $routeParams, storageService) {
        var vm = this;

        var map, marker_me, markerMovedTP, dragListener, markers = [],
            placesService, distanceService, directionsDisplay;

        $scope.$on("$destroy", function() { // Clear all listener and watches
            clearMarkers();
            google.maps.event.removeListener(dragListener);
        });

        (function() {
            let initMapCenter = storageService.mapPosition.lat ? storageService.mapPosition : new google.maps.LatLng(52.130930, 5.287404)
            let map_canvas = document.getElementById('map');
            map = new google.maps.Map(map_canvas, {
                zoom: 14,
                center: initMapCenter,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            google.maps.event.trigger(map, 'resize');

            marker_me = new google.maps.Marker({
                position: initMapCenter,
                map: map,
                title: 'Me',
                draggable: true,
                animation: google.maps.Animation.DROP,
            });

            placesService = new google.maps.places.PlacesService(map);
            distanceService = new google.maps.DistanceMatrixService()
            directionsDisplay = new google.maps.DirectionsRenderer({ 'draggable': true })
            directionsDisplay.setMap(map);

            findNearByRestaurants(map.getCenter());
        }())

        vm.placeMarkerInCenter = () => {
            marker_me.setPosition(map.getCenter())
            storageService.mapPosition = map.getCenter();
            findNearByRestaurants(map.getCenter())
        }

        dragListener = marker_me.addListener("dragend", function() {
            $timeout.cancel(markerMovedTP)
            markerMovedTP = $timeout(function() {
                // map.setCenter(marker_me.getPosition())
                storageService.mapPosition = map.getCenter();
                findNearByRestaurants(marker_me.getPosition())
            }, 100)
        })

        /**
         * Find near by restaurants
         * @param position - reference position
         */
        function findNearByRestaurants(position) {
            clearMarkers(); // Remove existing markers on map

            let request = {
                key: "AIzaSyBXUX1ZR82hKZ5PMtIw36-IUFLD-p5Kpgc",
                type: 'restaurant',
                location: position,
                radius: "5000",
            }

            placesService.nearbySearch(request, function(restaurants, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    // console.log('restaurants:', restaurants)
                    storageService.restaurants = restaurants; // For sync of restaurant between views
                    restaurants.forEach(place => { // Place each restaurant on map
                        createMarker(place);
                    })
                    if ($routeParams.restaurantId) { // If the view was changed from Restaurant's view, then create a route marker_me --> dst
                        $scope.getDirections($routeParams.restaurantId);
                    }

                    var distanceRequest = {
                        origins: [
                            [marker_me.getPosition().lat(), marker_me.getPosition().lng()].join(",")
                        ],
                        destinations: [],
                        travelMode: google.maps.TravelMode.DRIVING,
                        unitSystem: google.maps.UnitSystem.METRIC,
                        avoidHighways: false,
                        avoidTolls: false
                    }
                    restaurants.forEach((restaurant) => {
                        distanceRequest.destinations.push([restaurant.geometry.location.lat(), restaurant.geometry.location.lng()].join(","))
                    })

                    distanceService.getDistanceMatrix(distanceRequest, (distanceMatrix, status) => { // Find distance matrix to each restaurant from marker_me
                        if (status == google.maps.DistanceMatrixStatus.OK) {
                            distanceMatrix.rows[0].elements.forEach((elem, index) => {
                                restaurants[index].distance = elem.distance;
                                restaurants[index].duration = elem.duration;
                            })
                        }
                    })
                }
            })

            /**
             * Create a marker on map
             * @param place - marker location to be placed
             */
            function createMarker(place) {
                let marker_restaurant = new google.maps.Marker({
                    position: place.geometry.location,
                    icon: {
                        url: place.icon,
                        scaledSize: new google.maps.Size(20, 20)
                    },
                    title: place.name,
                    map: map
                })

                let photoAvailable = false
                if (place.photos && place.photos[0]) {
                    photoAvailable = true
                }

                let contentString = `
                    <div style="max-width: 125px" layout="column" layout-align="center center">
                        <img src="` + (photoAvailable ? place.photos[0].getUrl({ maxWidth: 50, maxHeight: 50 }) : "") + `" alt="Image" width="50">
                        <span>` + place.name + `</span>
                        <div layout="row" layout-align="start center">
                            <md-button class="md-raised md-primary md-fab md-mini" ng-click="getDirections('` + place.id + `')">
                                <md-icon>directions</md-icon>
                            </md-button>
                            <md-button md-colors="{'background-color': 'default-grey-500'}" class="md-raised md-fab md-mini" ng-click="viewRestaurant('` + place.id + `')">
                                <md-icon>mode_comment</md-icon>
                            </md-button>
                        </div>
                    </div> `

                let compiled = $compile(contentString)($scope) // Compile to add controller scope to infowindow

                let infowindow = new google.maps.InfoWindow({
                    content: compiled[0],
                    shadowStyle: 1,
                    padding: 1,
                    opacity: 0.3,
                    backgroundColor: 'rgba(57,57,57, 0.3)',
                    borderRadius: 5,
                    arrowSize: 10,
                    borderWidth: 1,
                    borderColor: '#2c2c2c',
                    disableAutoPan: true,
                    hideCloseButton: true,
                    arrowPosition: 30,
                    backgroundClassName: 'transparent',
                    arrowStyle: 2
                });

                marker_restaurant.addListener("click", function() {
                    closeInfoWindows(); // Close other info windows
                    infowindow.open(map, marker_restaurant)
                })

                markers.push({
                    marker: marker_restaurant,
                    infowindow: infowindow,
                })
            }

            /**
             * Closes all the open info windows
             * Used when other info windows are clicked
             */
            function closeInfoWindows() {
                markers.forEach(markerInfo => {
                    markerInfo.infowindow.close(map, markerInfo.marker)
                })
            }
        }

        /**
         * Clears all the restaurant marker on map
         * Used when new set of restaurant are loaded
         */
        function clearMarkers() {
            markers.forEach(markerInfo => {
                google.maps.event.clearListeners(markerInfo.marker, 'click')
                markerInfo.marker.setMap(null);
            })

            markers = [];
        }

        /**
         * Finds the matching restaurant in restaurants for the given id
         * @param restaurants - restaurants to find restaurantId from
         * @param restaurantId 
         */
        function getRestaurant(restaurants, restaurantId) {
            var restaurant = null;
            restaurants.some((_restaurant) => {
                if (_restaurant.id == restaurantId) {
                    restaurant = _restaurant;
                    return true;
                }
                return false;
            })

            return restaurant;
        }

        $scope.getDirections = (restaurantId) => {
            if (restaurantId) {
                directionsDisplay.set("directions", null);
                var restaurant = getRestaurant(storageService.restaurants, restaurantId)
                if (restaurant) {
                    let source = [marker_me.getPosition().lat(), marker_me.getPosition().lng()].join(",")
                    let destination = [restaurant.geometry.location.lat(), restaurant.geometry.location.lng()].join(",")
                    let request = {
                        origin: source,
                        destination: destination,
                        travelMode: google.maps.TravelMode.DRIVING
                    };
                    var directionsService = new google.maps.DirectionsService();
                    directionsService.route(request, function(response, status) {
                        if (status == google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(response);
                        }
                    });
                }
            }

        }

        /**
         * Takes you to restaurant view and pops up the chosen restaurant
         */
        $scope.viewRestaurant = (restaurantId) => {
            $location.path("/restaurants/" + restaurantId);
        }

    }])
}