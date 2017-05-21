import * as angular from "angular"
import {} from "angular-animate"
import {} from "angular-aria"
import {} from "angular-resource"
import {} from "angular-material"
import {} from 'angular-messages'
import {} from 'angular-route'
import {} from 'angular-jk-rating-stars'

require("angular-material/angular-material.css");
require("angular-jk-rating-stars/dist/jk-rating-stars.css");
require("../../../public/css/index.css");

var app = angular.module('app', ['ngMaterial', 'ngResource', 'ngAnimate', 'ngAria', 'ngMessages', 'ngRoute', 'jkAngularRatingStars'])

app.config(['$routeProvider', '$mdThemingProvider', function($routeProvider, $mdThemingProvider) {

    $mdThemingProvider.enableBrowserColor({
        theme: 'default',
        palette: 'accent',
        hue: '200'
    })

    $routeProvider
        .when("/map", {
            templateUrl: "/portal/home/map",
            controller: 'mapCtrl',
            controllerAs: 'vm'
        })
        .when("/map/:restaurantId", {
            templateUrl: "/portal/home/map",
            controller: 'mapCtrl',
            controllerAs: 'vm'
        })
        .when("/restaurants", {
            templateUrl: "/portal/home/restaurants",
            controller: 'restaurantCtrl',
            controllerAs: 'vm'
        })
        .when("/restaurants/:restaurantId", {
            templateUrl: "/portal/home/restaurants/",
            controller: 'restaurantCtrl',
            controllerAs: 'vm'
        })

    .otherwise({
        redirectTo: "/map"
    })
}]);

require("babel-loader!./common")(app)
    // require("./starRating")(app)
require("babel-loader!./map")(app)
require("babel-loader!./restaurants")(app)