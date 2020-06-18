$(document).ready(function() {

        // var for each input text
    
        var cityIn= $('#city-input');
        var search= $('#search-button');
        var cityList=$('#city-list');
        var linkedCity=$('.linked-city');
        var clearHistory=$('#clear-history');
        var savedCity=localStorage.getItem("CityName");

        $( document ).ready(function() {
                searchCityCurrent(savedCity);
        });

        var searchAllApi = function(lat,lon,city) {
                var queryURL = "http://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&appid=3d2eba2899ca96d0744357d56d76b302";

                $.ajax({
                        url: queryURL,
                        method: "GET"
                }).then(function(response) {

                        $("#city-name").empty();
                        $("#temperature").empty();
                        $("#humidity").empty();
                        $("#wind-speed").empty();
                        $("#UV-index").empty();

                        $("#city-name").append("<b>City</b>: " + city);
                        $("#temperature").append("<b>Current Temp:</b> " + kelvinToFahrenheit(response.current.temp) + " F");
                        $("#humidity").append("<b>Humidity:</b> " + response.current.humidity + "%");
                        $("#wind-speed").append("<b>Wind Speed:</b> " + response.current.wind_speed + " m/sec");

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
                        
                        var day1iconurl = "http://openweathermap.org/img/wn/" + day1icon;
                        var day2iconurl = "http://openweathermap.org/img/wn/" + day2icon;
                        var day3iconurl = "http://openweathermap.org/img/wn/" + day3icon;
                        var day4iconurl = "http://openweathermap.org/img/wn/" + day4icon;
                        var day5iconurl = "http://openweathermap.org/img/wn/" + day5icon;


                        var day1Date=goodDate(day1obj.dt).substring(0,9);
                        var day2Date=goodDate(day2obj.dt).substring(0,9);
                        var day3Date=goodDate(day3obj.dt).substring(0,9);
                        var day4Date=goodDate(day4obj.dt).substring(0,9);
                        var day5Date=goodDate(day5obj.dt).substring(0,9);

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


                        $("#day1").empty();
                        $("#day2").empty();
                        $("#day3").empty();
                        $("#day4").empty();
                        $("#day5").empty();

                        $("#day1").append(day1Date);
                        $("#day2").append(day2Date);
                        $("#day3").append(day3Date);
                        $("#day4").append(day4Date);
                        $("#day5").append(day5Date);

                        $("#day1").append("<br><img src='" + day1iconurl + "'>");
                        $("#day2").append("<br><img src='" + day2iconurl + "'>");
                        $("#day3").append("<br><img src='" + day3iconurl + "'>");
                        $("#day4").append("<br><img src='" + day4iconurl + "'>");
                        $("#day5").append("<br><img src='" + day5iconurl + "'>");

                        $("#day1").append("<br>" + day1temp + " F");
                        $("#day2").append("<br>" + day2temp + " F");
                        $("#day3").append("<br>" + day3temp + " F");
                        $("#day4").append("<br>" + day4temp + " F");
                        $("#day5").append("<br>" + day5temp + " F");

                        $("#day1").append("<br>" + day1humidity + "% humidity");
                        $("#day2").append("<br>" + day2humidity + "% humidity");
                        $("#day3").append("<br>" + day3humidity + "% humidity");
                        $("#day4").append("<br>" + day4humidity + "% humidity");
                        $("#day5").append("<br>" + day5humidity + "% humidity");

                });
        };

        function kelvinToFahrenheit(kel) {
                var fahr = 1.8 * (kel - 273) + 32;
                return fahr.toFixed(1);
        }

        function goodDate(dt) {
                var unixTimeStamp = dt;
                var timestampInMilliSeconds = unixTimeStamp*1000;
                var date = new Date(timestampInMilliSeconds);
                var formattedDate = date.toLocaleString();

                return (formattedDate);
        }

        var searchCityCurrent = function(city) {
                var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=3d2eba2899ca96d0744357d56d76b302";
                $.ajax({
                  url: queryURL,
                  method: "GET",
                  async: "false"
                }).then(function(response) {

                        var lon=response.coord.lon;
                        var lat=response.coord.lat;

                        searchAllApi(lat,lon,city);                
                });
        };

    
        search.on('click', function() {
            event.preventDefault();
            cityList.append("<a href='#' class='list-group-item list-group-item-action linked-city'>" + cityIn.val() + "</a>");
            linkedCity=$('.linked-city');

            savedCity=cityIn.val();

            searchCityCurrent(cityIn.val());  

            linkedCity.on('click', function() {
                event.preventDefault();
                searchCityCurrent(event.currentTarget.innerText);  
                savedCity=event.currentTarget.innerText;
            });

            localStorage.setItem("CityName",savedCity);

        });

        clearHistory.on('click', function() {
                event.preventDefault();
                $("#city-list").empty();
                //                searchCityCurrent(cityIn.val());  
        
        });

    

    });