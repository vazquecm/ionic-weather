// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova', 'angular-skycons'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('root', {
    url: '/root',
    templateURL: 'templates/root.html'
  })

    // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('root');


})

/// handles request to weather api - wunderground.com
.controller('weatherCtrl', function($http){ 

  var weather = this;
  weather.color = "blue";
  
  var apiKey = "e0a562410e2f48ee/";
  var url = "http://api.wunderground.com/api/" + apiKey + "conditions/q/";

  /// calling to api for their ip address
  $http.get(url + 'autoip.json').then(parseWUData);

  /// getting long and lat for current position
  navigator.geolocation.getCurrentPosition(function (geoPosition) {
    var lat  = geoPosition.coords.latitude;
    var long = geoPosition.coords.longitude;

    /// getting data back that includes long and lat 
    $http.get(url + lat + ',' + long + '.json').then(parseWUData);
  });

  /// this function allows searches by city     
  weather.search = function() {
    $http
      .get(url + weather.searchQuery + '.json')
      .then(parseWUData)
      .then(function (res) {
        console.log(res);

        /// this code gets the data of objects by using JSON to string them together turning them into an array
        var historyArray = JSON.parse(localStorage.getItem('searchHistoryArray')) || [];
          if (historyArray.indexOf(res.data.current_observation.station_id) === -1) {
          historyArray.push(res.data.current_observation.station_id);
          localStorage.setItem('searchHistoryArray', JSON.stringify(historyArray));
          console.log("stuff");

        }

        var history = JSON.parse(localStorage.getItem('searchHistory')) || {};

        /// if location exist than it overwrites with new station id and if not it creates it...adavantages of using an array in an "if" statement
        history[res.data.current_observation.display_location.full]= res.data.current_observation.station_id;
          localStorage.setItem('searchHistory', JSON.stringify(history));
          console.log("stuff");

      });
    console.log("are we searching?");
  }
  /// this function is getting location, temp, and image data from api to display on DOM
  function parseWUData (res) {
    var data = res.data.current_observation;
    console.log("data", data);
    weather.location = data.display_location.full;
    weather.temp = parseInt(data.temp_f);
    weather.image = data.icon_url;
    // weather.hiTemp = parseInt(data.)
    console.log(weather.location);
    console.log(weather.temp);
    console.log(weather.image);

    return res;

  };


});