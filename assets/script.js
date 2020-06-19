$(document).ready(function() {

        //variables used throughout to get input from user, trigger searching for weather for a city
        //and other things important to the application
        var cityIn= $('#city-input');
        var search= $('#search-button');
        var cityList=$('#city-list');
        var linkedCity=$('.linked-city');
        var clearHistory=$('#clear-history');
        var savedCity=localStorage.getItem("CityName");

        //When page loads, it will show the last searched city instead of opening a blank page.
        $( document ).ready(function() {
                searchCityCurrent(savedCity);
        });

        //Gets all weather relate info for a city based on lat and longitude
        var searchAllApi = function(lat,lon,city) {
                var queryURL = "http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=3d2eba2899ca96d0744357d56d76b302";

                $.ajax({
                        url: queryURL,
                        method: "GET"
                }).then(function(response) {

                        //Builds weather information on the page html elements at a time
                        $("#city-name").empty();
                        $("#temperature").empty();
                        $("#humidity").empty();
                        $("#wind-speed").empty();
                        $("#UV-index").empty();

                        //Build the current weather html
                        $("#city-name").append("<b>City</b>: " + city);
                        $("#temperature").append("<b>Current Temp:</b> " + kelvinToFahrenheit(response.current.temp) + " F");
                        $("#humidity").append("<b>Humidity:</b> " + response.current.humidity + "%");
                        $("#wind-speed").append("<b>Wind Speed:</b> " + response.current.wind_speed + " m/sec");

                        //Change color of UV index based on how bad it is
                        if (response.current.uvi <=5) {
                                $("#UV-index").css("color", "green");        
                        }
                        else if (response.current.uvi <=7) {
                                $("#UV-index").css("color", "yellow");        
                        }
                        else {
                                $("#UV-index").css("color", "red");        
                        }

                        $("#UV-index").append("<b>UV index:</b> " + response.current.uvi);

                        var day1obj=response.daily[0];
                        var day2obj=response.daily[1];
                        var day3obj=response.daily[2];
                        var day4obj=response.daily[3];
                        var day5obj=response.daily[4];

                        var day1icon = day1obj.weather[0].icon + ".png";
                        var day2icon = day2obj.weather[0].icon + ".png";
                        var day3icon = day3obj.weather[0].icon + ".png";
                        var day4icon = day4obj.weather[0].icon + ".png";
                        var day5icon = day5obj.weather[0].icon + ".png";
                        
                        //Build URL to images of weather
                        var day1iconurl = "http://openweathermap.org/img/wn/" + day1icon;
                        var day2iconurl = "http://openweathermap.org/img/wn/" + day2icon;
                        var day3iconurl = "http://openweathermap.org/img/wn/" + day3icon;
                        var day4iconurl = "http://openweathermap.org/img/wn/" + day4icon;
                        var day5iconurl = "http://openweathermap.org/img/wn/" + day5icon;

                        //Changes unix time into human readable dates
                        var day1Date=goodDate(day1obj.dt).substring(0,9);
                        var day2Date=goodDate(day2obj.dt).substring(0,9);
                        var day3Date=goodDate(day3obj.dt).substring(0,9);
                        var day4Date=goodDate(day4obj.dt).substring(0,9);
                        var day5Date=goodDate(day5obj.dt).substring(0,9);

                        //Turns kelvin temp into fahrenheit
                        var day1temp=kelvinToFahrenheit(day1obj.temp.max);
                        var day2temp=kelvinToFahrenheit(day2obj.temp.max);
                        var day3temp=kelvinToFahrenheit(day3obj.temp.max);
                        var day4temp=kelvinToFahrenheit(day4obj.temp.max);
                        var day5temp=kelvinToFahrenheit(day5obj.temp.max);

                        var day1humidity=day1obj.humidity;
                        var day2humidity=day2obj.humidity;
                        var day3humidity=day3obj.humidity;
                        var day4humidity=day4obj.humidity;
                        var day5humidity=day5obj.humidity;

                        //Beginning of building the 5 day forecast section
                        $("#day1").empty();
                        $("#day2").empty();
                        $("#day3").empty();
                        $("#day4").empty();
                        $("#day5").empty();

                        //Date first
                        $("#day1").append(day1Date);
                        $("#day2").append(day2Date);
                        $("#day3").append(day3Date);
                        $("#day4").append(day4Date);
                        $("#day5").append(day5Date);

                        //Then icon
                        $("#day1").append("<br><img src='" + day1iconurl + "'>");
                        $("#day2").append("<br><img src='" + day2iconurl + "'>");
                        $("#day3").append("<br><img src='" + day3iconurl + "'>");
                        $("#day4").append("<br><img src='" + day4iconurl + "'>");
                        $("#day5").append("<br><img src='" + day5iconurl + "'>");

                        //Then current temp
                        $("#day1").append("<br>" + day1temp + " F");
                        $("#day2").append("<br>" + day2temp + " F");
                        $("#day3").append("<br>" + day3temp + " F");
                        $("#day4").append("<br>" + day4temp + " F");
                        $("#day5").append("<br>" + day5temp + " F");

                        //Then humidity
                        $("#day1").append("<br>" + day1humidity + "% humidity");
                        $("#day2").append("<br>" + day2humidity + "% humidity");
                        $("#day3").append("<br>" + day3humidity + "% humidity");
                        $("#day4").append("<br>" + day4humidity + "% humidity");
                        $("#day5").append("<br>" + day5humidity + "% humidity");

                });
        };

        //Function that returns fahrenheit from kelvin
        function kelvinToFahrenheit(kel) {
                var fahr = 1.8 * (kel - 273) + 32;
                return fahr.toFixed(1);
        }

        //Function that turns unixtime into human readable format
        function goodDate(dt) {
                var unixTimeStamp = dt;
                var timestampInMilliSeconds = unixTimeStamp*1000;
                var date = new Date(timestampInMilliSeconds);
                var formattedDate = date.toLocaleString();

                return (formattedDate);
        }

        //This function calls one api which returns the lat and long of a city which 
        //is the input for the all api function
        var searchCityCurrent = function(city) {
                var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=3d2eba2899ca96d0744357d56d76b302";
                $.ajax({
                  url: queryURL,
                  method: "GET",
                  async: "false"
                }).then(function(response) {

                        //Stores lat and long to be used to find weather info
                        var lon=response.coord.lon;
                        var lat=response.coord.lat;

                        //Call function that creates all weather related parts of the page
                        searchAllApi(lat,lon,city);                
                });
        };

        //When search button is clicked, these things happen
        search.on('click', function() {
            event.preventDefault();
            //Builds the left list of cities that have been searched before
            cityList.append("<a href='#' class='list-group-item list-group-item-action linked-city'>" + cityIn.val() + "</a>");
            linkedCity=$('.linked-city');

            savedCity=cityIn.val();

            searchCityCurrent(cityIn.val());  

            //When a user clicks one of the cities that has already been searched for, then it 
            //will show then the weather info for that city
            linkedCity.on('click', function() {
                event.preventDefault();
                searchCityCurrent(event.currentTarget.innerText);  
                savedCity=event.currentTarget.innerText;
            });

            //Store the last city searched for into local storage
            localStorage.setItem("CityName",savedCity);
        });

        //When they click Clear History button then the list of previously searched cities is erased
        clearHistory.on('click', function() {
                event.preventDefault();
                $("#city-list").empty();
        
        });

    });