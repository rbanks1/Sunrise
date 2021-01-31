// Drawing from the Sunrise Sunset API
// https://sunrise-sunset.org/api
// Could also use MapQuest to do a location lookup:
// https://developer.mapquest.com/documentation/geocoding-api/address/get/


var urls= [];
var specialDays=[];
var urlCount;
var eachDay = [];
var numberOfDays = 367;
var morningLimit = 4;
var eveningLimit = 22;
var titleText = "CHERTSEY, SURREY, UK";
var subTitleText = "Sunrise & Sunsets in 2021";
var todaysDate;
var labelHeight = 0;
var dataWeather;
var weatherLoaded = false;
var offsetX = 100;
var daySeparation = 5;
var lineScale = 100;
var weatherScale = 5;
var hourSeconds = 60 * 60;
var sunriseHour = 0;
var sunsetHour = 0;
var noonPosition = (hourSeconds*12)/lineScale;

// Colours
var colorBackground;
var colorHoursText;
var colorHoursLine;
var colorWeekdayLines;
var colorWeekendLines;
var colorNewMonthText;
var colorNewMonthLine;
var colorSunriseNewHourText;
var colorSunriseNewHourLine;
var colorSunsetNewHourText;
var colorSunsetNewHourLine;
var colorSpecialDayText;
var colorSpecialDayLine;
var colorTitleText;
var colorMaxTemp;
var colorMinTemp;
var colorAvgTemp;

// Text Sizes
var textSizeBody = 16;
var textSizeTitle = 30;
var textSizeSubTitle = 18;
var textSizeMonths = 12;
var textSizeHours = 10;
var textSizeNewHour = textSizeHours;
var textSizeSpecialDay = textSizeHours;

// Line Weights
var strokeWeightMonth = 0.1;
var strokeWeightHours = 0.1;
var strokeWeightHoursNoon = 0.5;
var strokeWeightNewHourCircle = 1;
var strokeWeightSpecialDayCircle = 1;
var strokeWeightDefault = 3;
var strokeWeightSpecialDayConnectionLine = .5;
var strokeWeightNewHourConnectionLine = .5;

// Circle Sizes
var circleSizeSpecialDay = 6;
var circleSizeNewHour = 6;

function preload() {
  // Load topics from a JSON file
  var url =
   'http://www.mrmatsumoto.com/experiments/Sunrise/weatherArray.json';// https://www.visualcrossing.com/weather/weather-data-services
  dataWeather = loadJSON(url,loadedEntities);
}

function loadedEntities() {
  weatherLoaded = true;
}

function setup() {
  // Get the sunrise/Sunset details based on the latitude and longitude of Chertsey
  frameRate(30);
  createCanvas(2000, windowHeight);

  todaysDate = moment();

  // Setup colors http://designermag.org/wp-content/uploads/2014/02/CSS-Colors.jpg
  colorBackground = color('steelblue');//180
  colorHoursText = color('white');
  colorHoursLine = color('white');
  colorWeekdayLines = color(220);
  colorWeekendLines = color('white');
  colorNewMonthText = color('white');
  colorNewMonthLine = color('white');
  colorSunriseNewHourText = color('yellow');
  colorSunriseNewHourLine = color('yellow');
  colorSunsetNewHourText = colorSunriseNewHourText;
  colorSunsetNewHourLine = colorSunriseNewHourLine;
  colorSpecialDayText = color('paleturquoise');//lime
  colorSpecialDayLine = color('paleturquoise');
  colorTitleText = color('white');
  colorTodayLine = color('red');
  colorMaxTemp = color('darkorange');
  colorMinTemp = color('aqua');
  colorAvgTemp = color('mediumorchid');

  //Set up special days ✨⛪★☃ https://www.utf8icons.com/subsets/miscellaneous-symbols
  specialDays.push(new specialDay('09-29', 'Michaelmas', '🕭', 35));
  specialDays.push(new specialDay('03-25', 'Lady Day', '🕭', 35));
  specialDays.push(new specialDay('06-20', 'Summer Solstice', '★', null));
  specialDays.push(new specialDay('12-21', 'Winter Solstice', '★', 25));
  specialDays.push(new specialDay('03-20', 'Spring Equinox', '★', 25));
  specialDays.push(new specialDay('09-22', 'Vernal Equinox', '★', 12));
  specialDays.push(new specialDay('12-25', 'Christmas Day', '☃', 70));
  specialDays.push(new specialDay('12-19', 'Sunday Before Christmas', '☃', 55));
  specialDays.push(new specialDay('01-03', 'Sarah', '♫', 40));
  specialDays.push(new specialDay('01-11', 'Meg', '♫', 25));
  specialDays.push(new specialDay('02-20', 'Malcolm', '♫', 25));
  specialDays.push(new specialDay('04-20', 'Richard', '♫', 20));
  specialDays.push(new specialDay('07-18', 'Shannon', '♫', 25));
  specialDays.push(new specialDay('12-19', 'Maddie', '♫', 40));
  specialDays.push(new specialDay('02-14', 'Valentine', '♡', 60));
  specialDays.push(new specialDay('02-02', 'Groundhog Day', '🐿', 40));
  specialDays.push(new specialDay('07-04', 'July 4th', '⚐', 40));


  // Set up an array of URLS for the days I want sunset data for
  // This is currently every day of the year from January 1st

  for (let i = 1; i < numberOfDays; i++) {
    var date = moment().dayOfYear(i).format('YYYY-MM-DD');
    urls.push('https://api.sunrise-sunset.org/json?lat=51.391924&lng=-0.50365&date=' + date + '&formatted=0'); //Chertsey
    //urls.push('https://api.sunrise-sunset.org/json?lat=47.60357&lng=-122.32945&date=' + i + '&formatted=0'); //Seattle
  }
  urlCount = urls.length;

  var url = urls.shift();
  httpGet(url, 'jsonp', false, resultFromCall);

}

function resultFromCall(response) {
  // when the HTTP request completes, populate the variable that holds the
  // sunrise and sunset data used in the visualization.
  sunriseSunset = response;
  eachDay.push(new dayData(response.results.sunrise, response.results.sunset));
  if (urls.length > 0){
    var url = urls.shift();
    httpGet(url, 'jsonp', false, resultFromCall);
  }

}

function draw() {

  background(colorBackground);
  var numberOfElement = 0;


  //Draw title
  noStroke();
  fill(colorTitleText);
  textAlign(LEFT, CENTER);
  textSize(textSizeTitle);
  text(titleText, 60, 60);

  //Draw Sub Title
  noStroke();
  fill(colorTitleText);
  textSize(textSizeSubTitle);
  text(subTitleText, 60, 90);

  //draw horizontal timelines
  for (let i = morningLimit; i < eveningLimit+1; i++) {
    noStroke();
    fill(colorHoursText);
    textAlign(RIGHT, CENTER);
    textSize(textSizeHours);
    var hourText = str_pad_left(i,0,2) + ':00';
    var hourLineY = (hourSeconds*i)/lineScale;
    text(hourText,45,hourLineY);
  
    stroke(colorHoursLine);
    if (i === 12) {strokeWeight(strokeWeightHoursNoon);}
    else {strokeWeight(strokeWeightHours);}
    line(50, hourLineY, width, hourLineY);
  }

  //draw weather markers
  // Data columns: Name,	Period,	Maximum Temperature,	Minimum Temperature,	Temperature,	Wind Chill,	
  // Heat Index,	Precipitation,	Snow,	Snow Depth,	Wind Speed, Wind Gust,	Visibility,	
  // Cloud Cover, Relative Humidity, Contributing Stations

  textAlign(RIGHT, CENTER);
  text("-10", 80, noonPosition - (-10 * weatherScale));
  text("0", 80, noonPosition - (0 * weatherScale));
  text("10", 80, noonPosition - (10 * weatherScale));
  text("20", 80, noonPosition - (20 * weatherScale));

  //Repeat for each day
  eachDay.forEach(element => {

    var elementX = (numberOfElement * daySeparation) +offsetX;

    var sunriseSeconds = element.sunrise.hours()*3600 + element.sunrise.minutes() * 60 + element.sunrise.seconds();
    var sunsetSeconds = element.sunset.hours()*3600 + element.sunset.minutes() * 60 + element.sunset.seconds();

    //Is today the beginning of a new month?
    var dayOfTheMonth = element.sunrise.date();
    if (dayOfTheMonth === 1) {
      stroke(colorNewMonthLine);
      strokeWeight(strokeWeightMonth);
      ellipse(elementX, (hourSeconds*12)/lineScale, 3);
      line(elementX, (hourSeconds*22.1)/lineScale, elementX, (hourSeconds*3.9)/lineScale);

      noStroke();   
      fill(colorNewMonthText);
      textAlign(CENTER, BOTTOM);
      textSize(textSizeMonths);
      text(element.sunrise.format('MMM').toUpperCase() , elementX, (hourSeconds*3.8)/lineScale);
    }

    //Draw default line for this day
    strokeWeight(strokeWeightDefault);

    var dayOfTheWeek = element.sunrise.day();
 
    if (element.sunrise.format('YYYY MM DD') === todaysDate.format('YYYY MM DD')){
      stroke(colorTodayLine);
    }
    else if (dayOfTheWeek === 0 || dayOfTheWeek === 6) {
      stroke(colorWeekendLines);
    } else{
      stroke(colorWeekdayLines);
    }

    line(elementX, sunriseSeconds/lineScale, elementX, sunsetSeconds/lineScale);

    // SUNRISE?
    // Is today's sunrise in a new hour?
    if (sunriseHour != element.sunrise.hour() && numberOfElement!=0){
      stroke(colorBackground);
      fill(colorSunriseNewHourLine);
      strokeWeight(strokeWeightNewHourCircle);
      circle(elementX,sunriseSeconds/lineScale, circleSizeNewHour);

      noStroke();
      fill(colorSunriseNewHourText);
      textAlign(CENTER, BOTTOM);
      textSize(textSizeNewHour);
      var newY = (sunriseSeconds/lineScale) - 5;
      text('☀ ' + element.sunrise.format("Do"), elementX, newY);

      stroke(colorSunriseNewHourLine);
      strokeWeight(strokeWeightNewHourConnectionLine);
      line(elementX,sunriseSeconds/lineScale,elementX, newY);

      sunriseHour = element.sunrise.hour();
    } else{
      sunriseHour = element.sunrise.hour();
    }

    // SUNSET?
    // Is today's sunset in a new hour?
    if (sunsetHour != element.sunset.hour() && numberOfElement!=0){
      stroke(colorBackground);
      fill(colorSunsetNewHourLine);
      strokeWeight(strokeWeightNewHourCircle);
      circle(elementX,sunsetSeconds/lineScale, circleSizeNewHour);
      
      noStroke();
      fill(colorSunsetNewHourText);
      textAlign(CENTER, TOP);
      textSize(textSizeNewHour);
      text('☽ ' + element.sunset.format("Do"), elementX, (sunsetSeconds/lineScale) + 8);

      stroke(colorSunriseNewHourLine);
      strokeWeight(strokeWeightNewHourConnectionLine);
      line(elementX,sunsetSeconds/lineScale,elementX, (sunsetSeconds/lineScale) + 7);

      sunsetHour = element.sunset.hour();
    }else{
      sunsetHour = element.sunset.hour();
    }

    // SPECIAL?
    // Is today a special day?
    specialDays.forEach(elementSpecialDay => {
      if (element.sunset.format("MM-DD") === elementSpecialDay.date){
        stroke(colorBackground);
        fill(colorSpecialDayLine);
        strokeWeight(strokeWeightSpecialDayCircle);
        circle(elementX,sunriseSeconds/lineScale, circleSizeSpecialDay);

        noStroke();
        fill(colorSpecialDayText);
        textAlign(CENTER, BOTTOM);
        textSize(textSizeSpecialDay);
        var newY = (sunriseSeconds/lineScale) - elementSpecialDay.offset;
        text(elementSpecialDay.icon + ' ' + elementSpecialDay.name, elementX, newY);

        stroke(colorSpecialDayLine);
        strokeWeight(strokeWeightSpecialDayConnectionLine);
        line(elementX,sunriseSeconds/lineScale,elementX, newY);
      }
    });

    // WEATHER
    // Draw weather marks
    if (weatherLoaded){
      print(numberOfElement);
      var maxToday = dataWeather[numberOfElement][2];
      var minToday = dataWeather[numberOfElement][3];
      var avgToday = dataWeather[numberOfElement][4];
      drawWeatherBands(maxToday, minToday , avgToday, elementX);
    }

    numberOfElement++;

  });

}

function mouseClicked(event){
  saveCanvas('sunRiseSet', 'png');
}

// DRAW WEATHER BANDS
// Figure out the weather bands of colour based on the maximum and minimum
function drawWeatherBands(max, min, avg, x){

  var coloursSection = ['red', 'orangered','orange','gold','yellow','lime','green','royalblue','blue','mediumpurple'];
  var currentTemp = 40.0;
  var avgColour;

  strokeCap(SQUARE);


  for (var section = 0; section < 10; section++) {
    noFill();
    stroke(color(coloursSection[section]));
    strokeWeight(strokeWeightDefault);
    if(max > currentTemp && min < (currentTemp - 5.0)){
      line(x, noonPosition - (currentTemp * weatherScale), x, noonPosition - ((currentTemp - 5.0) * weatherScale));
    } else if (max <= currentTemp && max >= (currentTemp - 5.0)){
      line(x, noonPosition - (max * weatherScale), x, noonPosition - ((currentTemp - 5.0) * weatherScale));
    } else if (min <= currentTemp && min >= (currentTemp - 5.0)){
      line(x, noonPosition - (currentTemp * weatherScale), x, noonPosition - (min * weatherScale));     
    }
  
    if (avg <= currentTemp && avg >= (currentTemp-5)){
      avgColour = color(coloursSection[section]);
    }

    currentTemp = currentTemp - 5.0;
  }

  
  fill('white');
  noStroke();
  ellipse(x, noonPosition - (avg * weatherScale), 3);

  strokeCap(ROUND);
}

function secondsToHoursMinutesSeconds(differenceInSeconds){
  var hours = Math.floor(differenceInSeconds / 3600);
  var minutes = Math.floor((differenceInSeconds - (hours * 3600)) / 60);
  var seconds = differenceInSeconds - minutes * 60 - hours * 3600;
 
  var hoursMinutesSeconds = '' + str_pad_left(hours, '0', 2) + ':' + str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
  return hoursMinutesSeconds;
}

function str_pad_left(string,pad,length) { // From https://stackoverflow.com/questions/3733227/javascript-seconds-to-minutes-and-seconds
  return (new Array(length+1).join(pad)+string).slice(-length);
}


class dayData {

  constructor(sunrise, sunset) {
    this.sunrise = moment(sunrise); // See: https://momentjs.com/docs/
    this.sunset = moment(sunset);
 
    //var sunriseYear = this.sunrise.prototype.getFullYear();
    this.dayLength = (this.sunset - this.sunrise)/1000;
  }
}

class specialDay{
  constructor(date, name, icon, offset){
    this.date = date;
    this.name = name;
    this.icon = icon;
    if (offset === null){
      this.offset = 5;
    } else {
      this.offset = offset;
    }
  }
}MA