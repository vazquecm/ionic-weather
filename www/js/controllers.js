angular.module('ionicWeather.controllers', [])


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

        /// if location exist than it overwrites with new station id and if not it creates it...advantages of using an array in an "if" statement
        history[res.data.current_observation.display_location.full]= res.data.current_observation.station_id;
          localStorage.setItem('searchHistory', JSON.stringify(history));
          console.log(searchHistory);

      });


  }


  /// this function is getting location, temp, and image data from api to display on DOM
      function parseWUData (res) {
        var data = res.data.current_observation;
        console.log("data", data);
        weather.location = data.display_location.full;
        weather.temp = parseInt(data.temp_f);
        weather.image = data.icon_url;
        console.log(weather.location);
        console.log(weather.temp);
        console.log(weather.image);


        // var forecastday = res.data.forecast.forecastday;
        // weather.highTemp = res.data.forecast.forecastday[0].high.fahrenheit;
        // weather.lowTemp = res.data.forecast.forecastday[0].low.fahrenheit;
        // weather.highlow = "High: " + high + "℉ / Low: " + low;
        // console.log("highTemp", highTemp);
        // console.log("lowTemp", lowTemp);


        return res;


  };

});

