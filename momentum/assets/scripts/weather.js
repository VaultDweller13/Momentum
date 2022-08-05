const KEY = 'dd78fca7a4c44e2da151ed13848bf896';

export function getWeather(city) {
  return getCityCoordinates(city)
    .then(res => loadJson(`https://api.openweathermap.org/data/2.5/weather?lat=${res[0]}&lon=${res[1]}&units=metric&appid=${KEY}`))
    .then(getWeatherData);
}

const loadJson = url => fetch(url).then(res => res.json());

function getCityCoordinates(city) {
  return loadJson(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${KEY}`)
    .then(data => [data[0].lat, data[0].lon]);
}

function getWeatherData(data) {
  return {
    temp: data.main.temp,
    humidity: data.main.humidity,
    wind: data.wind.speed,
    clouds: data.weather[0].description
  }
}