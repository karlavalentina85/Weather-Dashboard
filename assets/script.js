$(document).ready(function() {
   
    // var for each input text

    let cityIn= $('#city-input');
    var search= $('#search-button');
    let cityName=$('#city-name');
    let clear=$('#clear-history');
    let currentTemp=$('#temperature');
    let currentHumid=$('#humidity');
    let currentWindSpeed=$('#wind-speed');
    let currentUv=$('#UV-index');
    let cityList=$('#city-list');

    var searchCity = function(city) {
        var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=3d2eba2899ca96d0744357d56d76b302";
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
            createRow(response);
        });
      };

      var createRow = function(data) {
        // Create a new table row element
//        var tRow = $("<tr>");
  
        // Methods run on jQuery selectors return the selector they we run on
        // This is why we can create and save a reference to a td in the same statement we update its text
//        var titleTd = $("<td>").text(data.Title);
//        var yearTd = $("<td>").text(data.Year);
//        var actorsTd = $("<td>").text(data.Actors);
          
        // Append the newly created table data to the table row
//        tRow.append(titleTd, yearTd, actorsTd);
        // Append the table row to the table body
//        $("#test").append(tRow);
//        alert(data.list[0].main.temp);
        $("#test").append(JSON.stringify(data));

      };
  

    search.on('click', function() {
        event.preventDefault();
        cityList.append("<a href='#' class='list-group-item list-group-item-action'>" + cityIn.val() + "</a>");
    
        searchCity(cityIn.val());  

        
    });
    
    
});
