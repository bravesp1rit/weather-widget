void function () {
  'use strict';

  const forecastContainer = document.querySelector('.forecast-row');
  const searchInput = document.querySelector('.search-input');
  const selectedCity = document.querySelector('.selected-city span');
  const currentTemperature = document.querySelector('.current-temperature');
  const todaySkyStatus = document.querySelector('.today-sky-status');
  const todayLocation = document.querySelector('.today-location');
  const todayWeatherIcon = document.querySelector('.today-weather-icon');
  const preloader = document.querySelector('.preloader');
  const day = new Date().getDay();
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const findDayofWeek = (i) => {
    if (i > 6) {
      return i - 7;
    } else {
      return i;
    }
  }

  const getLocationSucces = async (pos) => {
    Promise.all([
      getForecastData(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`),
      getCurrentData(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
    ]).then(async (data) => {
      if (data) {
        preloader.style.display = 'none';
        await setValues(data);
      }
    });
  }

  const getLocationError = async () => {
    Promise.all([
      getForecastData('lat=50.44&lon=30.53'),
      getCurrentData('lat=50.44&lon=30.53')
    ]).then(async (data) => {
      if (data) {
        preloader.style.display = 'none';
        await setValues(data);
      }
    });
  }
  navigator.geolocation.getCurrentPosition(getLocationSucces, getLocationError);

  async function getForecastData(userCity) {
    if (!userCity) return;
    const url = `https://api.openweathermap.org/data/2.5/forecast?${userCity}&appid=79c92655bc4f798d18248dbb52ba9088&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  async function getCurrentData(userCity) {
    if (!userCity) return;
    const url = `https://api.openweathermap.org/data/2.5/weather?${userCity}&appid=bb955a4e81070e233896ac130bacb8b3&units=metric`;
    const response = await fetch(url);
    const currentData = await response.json();
    return currentData;
  }

  function formatWeatherMain(weatherMainArr) {
    return weatherMainArr.map(item => item.weather[0].main.replace(/\s+/g, '-'));
  }

  async function setValues(data) {
    const selectedWeatherDay = data[0].list.filter(item => {
      return item.dt_txt.includes('12:00:00');
    });
    const selectedWeatherNight = data[0].list.filter(item => {
      return item.dt_txt.includes('3:00:00');
    })
    function setTemplate() {
      let template = ''
      for (let i = 0; i < 5; i++) {
        template += `
          <div class="forecast-item">
            <div class="item-day">${daysOfWeek[findDayofWeek(day + i)]}</div>
            <div class="item-weather-icon">
              <img src="./img/weather-${formatWeatherMain(selectedWeatherDay)[i]}.svg" alt="">
            </div>
            <div class="weather-status-text">${selectedWeatherDay[i].weather[0].main}</div>
            <div class="daily-status">
              <div class="daily-status-day">Day</div>
              <div class="daily-status-day-temperature">${Math.round(selectedWeatherDay[i].main.temp)}°C</div>
              <div class="daily-status-night-temperature">${Math.round(selectedWeatherNight[i].main.temp)}°C</div>
              <div class="daily-status-night">Night</div>
            </div>
          </div>`
      }
      return template;
    }

    forecastContainer.innerHTML = setTemplate();
    todayLocation.innerHTML = `${data[1].name}, ${data[1].sys.country}`;
    searchInput.value = `${data[1].name}, ${data[1].sys.country}`;
    selectedCity.innerHTML = `${data[1].name}, ${data[1].sys.country}`;
    currentTemperature.innerHTML = `${Math.round(data[1].main.temp)}°C`;
    todaySkyStatus.innerHTML = data[1].weather[0].main;
    todayWeatherIcon.innerHTML = `<img src="./img/weather-${data[1].weather[0].main.replace(/\s+/g, '-')}.svg" alt="">`;
  }

}()