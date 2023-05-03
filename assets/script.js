var currentWeatherEl = document.querySelector("#current-weather");
var currentTempInput = document.querySelector("#current-temp");
var currentWindInput = document.querySelector("#current-wind");
var currentHumidityInput = document.querySelector("#current-humidity");
var currentIconInput = document.querySelector("#current-icon");
var cityNameInput = document.querySelector("#searched-city");
var searchBtn = document.querySelector("#search-btn");
var currentHeader = document.querySelector("#current-header");
var forecastContainerEl = document.querySelector("#forecast-container");
var fiveDayEl = document.querySelector(".five-day");
var forecastHeaderEl = document.querySelector(".forecastHeader");
var historyList = document.querySelector(".history-container");
historyList.textContent = "Search History";

var renderForecastHeader = function () {
    var forecastHeading = document.createElement("h4");
    forecastHeading.textContent = "5 Day Forecast";
    forecastHeaderEl.append(forecastHeading);
};

var renderForecast = function (data) {
    renderForecastHeader();
    var arr = data.list;
    for (var i = 0; i < arr.length; i++) {
        if (arr [i].dt_txt.split(" ")[1] === "12:00:00") {
            var fiveDay = document.createElement("div");
            forecastContainerEl.append(fiveDay);
            var fiveDayCard = document.createElement("ul");
            fiveDay.append(fiveDayCard);
            var time5El = document.createElement("li");
            var temp5El = document.createElement("li");
            var wind5El = document.createElement("li");
            var humidity5El = document.createElement("li");
            var icon5El = document.createElement("img");
            time5El.textContent = arr[i].dt_txt;
            var icon5 = arr[i].weather[0].icon;
            icon5El.setAttribute(
                "src",
                "https://openweathermap.org/img/w/" + icon5 + ".png" 
            );
            temp5El.textContent = "temp: " + arr[i].main.temp + "°F";
            wind5El.textContent = "wind: " + arr[i].wind.speed + "MPH";
            humidity5El.textContent = "humidity: " + arr[i].main.humidity + "%";
            fiveDayCard.style.border = "2px black";
            fiveDayCard.style.display = "inline-block";
            fiveDayCard.style.backgroundColor = "black";
            fiveDayCard.style.color = "white";
            fiveDayCard.style.margin = "5px";
            fiveDayCard.append(time5El);
            fiveDayCard.append(temp5El);
            fiveDayCard.append(wind5El);
            fiveDayCard.append(humidity5El);
            fiveDayCard.append(icon5El);
        }
    }
};

var renderCurrentWeather = function (data) {
    for (var i = 0; i < data.list.length; i++) {
        var temp = data.list[i].main.temp;
        var wind = data.list[i].wind.speed;
        var humidity = data.list[i].main.humidity;
        var time = dayjs().format("M/D/YYYY");
        var icon = data.list[i].weather[0].icon;

        currentHeader.textContent = cityNameInput.value + " " + time;
        currentIconInput.setAttribute(
            "src",
            "https://openweathermap.org/img/w/" + icon + ".png"
        );
        currentTempInput.textContent = "temp: " + temp + "°F";
        currentWindInput.textContent = "wind: " + wind + "MPH";
        currentHumidityInput.textContent = "humidity: " + humidity + "%";
        currentWeatherEl.classList.add("currentContainer");
    }
};

var renderLatLon = function (data) {
    var latInput = data[0].lat;
    var lonInput = data[0].lon;
    var fetchWeather = function () {
        var lat = latInput;
        var lon = lonInput;
        var forecastURL =
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=b89c09787bf9106df63088418a47c76b&ubits=imperial";
        fetch(forecastURL)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            renderCurrentWeather(data);
            renderForecast(data);
          })
          .catch(function (err) {
            console.log(err);
          });
    };
    fetchWeather();
};

var fetchCity = function () {
    cityNameInput = cityNameInput.value;
    var cityURL = 
    "https://api.openweathermap.org/geo/1.0/direct?q=" +
    cityNameInput +
    "&limit=1&appid=b89c09787bf9106df63088418a47c76b";
    fetch(cityURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        renderLatLon(data);
      })
      .catch(function (err) {
        console.log(err);
      });
};

searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    var searchValue = cityNameInput.value;
    fetchCity();
    setSearchHistory(searchValue);
    getSearchHistory(searchValue);
});

var getSearchHistory = function () {
    var localHistory = JSON.parse(localStorage.getItem("searchedCities")) || [];
    for (var i = 0; i < localHistory.length; i++) {
        var searchTerm = localHistory[i];
        var newLi = document.createElement("button");
        newLi.textContent = searchTerm;
        newLi.classList.add("btn");
        newLi.classList.add("searchbtn");
        newLi.style.display = "block";
        historyList.appendChild(newLi);
        newLi.addEventListener("click", function () {
            var searchValue = searchTerm;
            fetchCity(searchValue)
        })
    }
};

var setSearchHistory = function (text) {
    var searchBarHistory =
        JSON.parse(localStorage.getItem("searchedCities")) || [];
    searchBarHistory.push(text);
    localStorage.setItem("searchedCities", JSON.stringify(searchBarHistory));
};
