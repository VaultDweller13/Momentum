import * as slider from './slider.js';
import * as dateTime from './datetime.js';
import * as weather from './weather.js';
import * as quotes from './quotes.js';
import { playList } from './playList.js';

const body = document.querySelector('body');
const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');

// Audio player constants
const audioPlayer = header.querySelector('.audio-player'); 

// Slider constants
const sliderButtonLeft = main.querySelector('.left');
const sliderButtonRight = main.querySelector('.right');

// Date, time, greeting blocks constants
const dateBlock = main.querySelector('.date');
const timeBlock = main.querySelector('.time');
const greetingBlock = main.querySelector('.greeting-container');
const greetingMessage = greetingBlock.querySelector('.greeting-message');
const userName = greetingBlock.querySelector('.greeting-input');

// Weather block constants
const weatherBlock = header.querySelector('.weather-container');
const city = weatherBlock.querySelector('.weather-input');
const weatherIcon = weatherBlock.querySelector('.weather-icon');
const temperature = weatherBlock.querySelector('.weather-temperature');
const clouds = weatherBlock.querySelector('.weather-clouds');
const wind = weatherBlock.querySelector('.weather-wind');
const humidity = weatherBlock.querySelector('.weather-humidity');

// Quotes block
const blockquote = footer.querySelector('.blockquote');
const caption = footer.querySelector('.quote-caption'); 
const quoteRefreshButton = footer.querySelector('.button-refresh');

// Set background
body.style.backgroundImage = slider.setBackground(body, dateTime.getTimeOfDay());

// Set audio player
addTracks(playList);

function addTracks(playList) {
  console.log(playList);
  playList.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = `${item.title} - ${item.artist}`;
    audioPlayer.appendChild(li);
  }) 
}


// Slider buttons
sliderButtonLeft.addEventListener('click', e => body.style.backgroundImage = slider.changeSlide(body, -1));
sliderButtonRight.addEventListener('click', e => body.style.backgroundImage = slider.changeSlide(body, 1));

// Set time and date
showDateTime();

function showDateTime() {
  dateBlock.textContent = dateTime.getDate();
  timeBlock.textContent = dateTime.getTime();
  greetingMessage.textContent = `Good ${dateTime.getTimeOfDay()},`;

  setTimeout(showDateTime, 1000);
}

// Get weather
function showWeather(city) {
  weather.getWeather(city).then(weather => {
    temperature.textContent = `${weather.temp} ℃`;
    clouds.textContent = weather.clouds;
    wind.textContent = `Wind speed: ${weather.wind} m/s`;
    humidity.textContent = `Humidity: ${weather.humidity}%`;
    weatherIcon.style.backgroundImage = `url(${weather.icon}`;
  })
}

showWeather(city.value);
city.addEventListener('change', () => showWeather(city.value));

// Set quotes
showQuote();

quoteRefreshButton.addEventListener('click', () => {
  rotate(quoteRefreshButton, 180);
  showQuote();
})

function showQuote() {
  quotes.getQuote().then(quote => {
    blockquote.textContent = quote['quote'];
    caption.textContent = quote['author'];
  })
} 

function rotate(element, deg) {
  const rotation = element.style.transform;

  if (rotation) {
    const currentDeg = parseInt(rotation.split('(')[1]);
    deg += currentDeg;
  }

  element.style.transform = `rotate(${deg}deg)`;
}

// Set local storage
window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);

function setLocalStorage() {
  localStorage.setItem('city', city.value);
  localStorage.setItem('user', userName.value);
}

function getLocalStorage() {
  city.value ? localStorage.getItem('city') : 'Minsk';
  userName.value = localStorage.getItem('user');
}


