import * as angular from "angular"
import {} from "angular-animate"
import {} from "angular-aria"
import {} from "angular-resource"
import {} from "angular-material"

require("angular-material/angular-material.css")
require("../../../dist/login/styles.css")
// require("../css/login.css")
// var angular = require('angular')
// var app = angular.module('app', ['ngMaterial', 'ngAria', 'ngAnimate', 'ngResource']);
// app.run(() => {
//     console.log('Angular App is running')
// })
angular.module('app', ['ngMaterial', 'ngResource', 'ngAnimate', 'ngAria'])
            .controller("loginCtrl", function($scope, $window, $timeout, loginService) {
                console.log('Login Controller');
                $scope.loginUser = {}
                $scope.registerUser = {}
                $scope.invalidCredentials = false
                var invalidCredTP, formErrTP;
                $scope.showLoginForm = true;

                this.showLogin = function(show) {
                    $scope.showLoginForm = show;
                }

                this.register = function() {
                    console.log('Clicked Register');
                    loginService.register($scope.registerUser, function(data) {

                        $window.location.href = "/portal/index"

                    }, function(res) {
                        console.log(arguments);
                        $scope.formErrMsg = res.data.data
                        $timeout.cancel(formErrTP)
                        formErrTP = $timeout(function() {
                            $scope.formErrMsg = false
                        }, 5000)
                    })
                }

                this.login = function() {
                    // console.log('Clicked Login');
                    loginService.login($scope.loginUser, function(res) {
                        // console.log("Login Success:", res)

                        // if(res.data.error){
                        //     console.log('failed Login');
                        //     $scope.invalidCredentials = true
                        //     if (invalidCredTP) {
                        //         $timeout.cancel(invalidCredTP)
                        //     }
                        //     invalidCredTP = $timeout(function() {
                        //         $scope.invalidCredentials = false
                        //     }, 5000)
                        // } else {
                        //     $timeout(function(){
                                $window.location.href = "/portal/index"
                            // }, 20000)
                            
                        // }


                    }, function(data) {
                        console.log('failed Login');
                        $scope.invalidCredentials = true
                        if (invalidCredTP) {
                            $timeout.cancel(invalidCredTP)
                        }
                        invalidCredTP = $timeout(function() {
                            $scope.invalidCredentials = false
                        }, 5000)
                    })
                }
            })
            .service("loginService", function($resource) {
                return $resource("/login", {}, {
                    login: {
                        method: "POST"
                    },
                    register: {
                        url: "/register",
                        method: "POST"
                    }
                })
            })
