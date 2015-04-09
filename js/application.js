$(function() {
  
  var displayCities = function(){
    console.log('test');
  };

  $('#getLocationInfo').on('click', function(){
    var formValues = $("#locationInfo").serializeArray(); 
    var country = formValues[0].value
    var city = formValues[1].value

    $.ajax({
      url: 'http://api.wunderground.com/api/74530ca166fbe692/conditions/q/'+country+'/'+city+'.json',
      type: 'GET',
      dataType: 'json',
    })
    .done(function(data) {
      console.log("success");
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
    
  });

  $('#getSearchInfo').on('click', function(){
    var search = $("input[name=location]").val();

    $.ajax({
      url: 'http://autocomplete.wunderground.com/aq?query='+search,
      type: 'GET',
      dataType: 'jsonp',
      jsonp:'cb',
    })
    .done(function(data) {
      console.log("success");
      console.log(data)
      extractCities(data);
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
    
  });
   
  var extractCities = function(cities){
    $.each(cities, function( k, v ) {
      $.each(v, function( key, city ) {
        if(city.type === "city"){
          
          formatCity(city.name, city.c);
        }
      });
    });
  };

  var rowTemplate = $("<tr><td class='locationName'></td><td class='countryCode'></td><td><button class='btn btn-lrg'></button></td></td></tr>");

  var formatCity = function(name, countryCode){
    var cityRow = rowTemplate.clone();
    cityRow.find('.locationName').text(name);
    cityRow.find('.countryCode').text(countryCode);
    cityRow.find('button').text('More Information').attr('id', "moreInfo");
    $('#suggestedLocations').append(cityRow);
     

  };

  $(document).on('click', '#moreInfo', function(){
    var fullName = $(this).closest('tr').find('.locationName').text();
    var cityName = fullName.substring(0,(fullName.indexOf(",")));
    var secondaryName = fullName.substring(fullName.indexOf(",")+2,fullName.lenght);
     



    $.ajax({
      url: 'http://api.wunderground.com/api/74530ca166fbe692/conditions/q/'+secondaryName+'/'+cityName+'.json',
      type: 'GET',
      dataType: 'json',
    })
    .done(function(data) {
      console.log("success");
      console.log(data);
      insertWeather(data, fullName);
    })
    .fail(function() {
      console.log("error");
    })
    .always(function() {
      console.log("complete");
    });
        
  });


  var insertWeather = function(currentWeather, fullName){
    var temperature = currentWeather.current_observation.temp_c;
    var feelsLike = currentWeather.current_observation.feelslike_c;
    var relativeHumidity = currentWeather.current_observation.relative_humidity;
    var windKPH = currentWeather.current_observation.wind_kph; 

    $('#city').text(fullName);
    $('#feels').text(feelsLike);
    $('#temp').text(temperature);
    $('#humidity').text(relativeHumidity);
    $('#windKPH').text(windKPH);


  };
 

   



});






