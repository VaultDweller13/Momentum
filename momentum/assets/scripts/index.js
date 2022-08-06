import * as slider from './slider.js';
import * as dateTime from './datetime.js';
import * as weather from './weather.js'

const body = document.querySelector('body');
const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.foooter');

// Slider constants
const sliderButtonLeft = main.querySelector('.left');
const sliderButtonRight = main.querySelector('.right');

// Date, time, greeting blocks constants
const dateBlock = main.querySelector('.date');
const timeBlock = main.querySelector('.time');
const greetingBlock = main.querySelector('.greeting-message');

// Weather block constants
const weatherBlock = header.querySelector('.weather-container');
const city = weatherBlock.querySelector('.weather-input');
const weatherIcon = weatherBlock.querySelector('.weather-icon');
const temperature = weatherBlock.querySelector('.weather-temperature');
const clouds = weatherBlock.querySelector('.weather-clouds');
const wind = weatherBlock.querySelector('.weather-wind');
const humidity = weatherBlock.querySelector('.weather-humidity');

// Set background
body.style.backgroundImage = slider.setBackground(dateTime.getTimeOfDay());

// Set time and date
dateBlock.textContent = dateTime.getDate();
timeBlock.textContent = dateTime.getTime();
greetingBlock.textContent = `Good ${dateTime.getTimeOfDay()},`;

// Slider buttons
sliderButtonLeft.addEventListener('click', e => body.style.backgroundImage = slider.changeSlide(body, -1));
sliderButtonRight.addEventListener('click', e => body.style.backgroundImage = slider.changeSlide(body, 1));

// Get weather
function getWeather(city) {
  weather.getWeather(city).then(weather => {
    temperature.textContent = `${weather.temp} ℃`;
    clouds.textContent = weather.clouds;
    wind.textContent = `Wind speed: ${weather.wind} m/s`;
    humidity.textContent = `Humidity: ${weather.humidity}%`;
    weatherIcon.style.backgroundImage = `url(${weather.icon}`;
  })
}

getWeather(city.value);
city.addEventListener('change', () => getWeather(city.value));