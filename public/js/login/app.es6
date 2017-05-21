import * as angular from "angular"
import {} from "angular-animate"
import {} from "angular-aria"
import {} from "angular-resource"
import {} from "angular-material"
import {} from 'angular-messages'

require("angular-material/angular-material.css")
require("../../../public/css/login.css");

angular.module('app', ['ngMaterial', 'ngResource', 'ngAnimate', 'ngAria', 'ngMessages'])
    .controller("loginCtrl", ["$window", "$timeout", "loginService", function($window, $timeout, loginService) {
        var vm = this;
        vm.loginUser = {};
        vm.registerUser = {};
        vm.invalidCredentials = false;
        vm.showLoginForm = true;

        var invalidCredTP, formErrTP;

        vm.showLogin = function(show) {
            vm.showLoginForm = show;
        }

        vm.register = function() {
            loginService.register(vm.registerUser, function() {
                $window.location.href = "/portal/index"

            }, function(res) {
                console.log(arguments);
                vm.formErrMsg = res.data.data
                $timeout.cancel(formErrTP)
                formErrTP = $timeout(function() {
                    vm.formErrMsg = false
                }, 5000)
            })
        }

        vm.login = function() {
            loginService.login(vm.loginUser, function() {
                $window.location.href = "/portal/index"
            }, function() {
                console.log('Login failed');
                vm.invalidCredentials = true
                if (invalidCredTP) {
                    $timeout.cancel(invalidCredTP)
                }
                invalidCredTP = $timeout(function() {
                    vm.invalidCredentials = false
                }, 5000)
            })
        }
    }])
    .service("loginService", ["$resource", function($resource) {
        return $resource("/login", {}, {
            login: {
                method: "POST"
            },
            register: {
                url: "/register",
                method: "POST"
            }
        })
    }])