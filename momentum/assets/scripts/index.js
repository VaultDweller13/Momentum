import * as slider from './slider.js';
import * as dateTime from './datetime.js';
import * as weather from './weather.js';
import * as quotes from './quotes.js';
import * as settings from './settings.js';
import { AudioPlayer } from './audioPlayer.js'
import { playList } from './playList.js';

let lang = 'EN';

const body = document.querySelector('body');
const header = document.querySelector('.header');
const main = document.querySelector('.main');
const footer = document.querySelector('.footer');

// Audio player constants
const audioPlayer = header.querySelector('.audio-player'); 
const playButton = header.querySelector('.play');
const prevButton = header.querySelector('.prev-track');
const nextButton = header.querySelector('.next-track');

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
const weatherError = header.querySelector('.weather-error');
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

// Settings pop-up
const settingsButton = document.querySelector('.settings-button');
const popUpContainer = document.querySelector('.pop-up-container')
const settingsPopUp = document.querySelector('.pop-up-settings');
const blockSelectors = Array.from(document.querySelectorAll('.block-selector'));
const languageSelector = document.querySelector('.language-select');

// Set local storage
window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);

function setLocalStorage() {
  localStorage.setItem('city', city.value);
  localStorage.setItem('user', userName.value);
}

function getLocalStorage() {
  if (localStorage.getItem('city')) {
    city.value = localStorage.getItem('city');
  }

  if (localStorage.getItem('user')) {
    userName.value = localStorage.getItem('user');
  }
}

// Set background
body.style.backgroundImage = slider.setBackground(body, dateTime.getTimeOfDay('EN'));

// Set audio player
const player = new AudioPlayer(playList);

player.showPlayList(audioPlayer);

playButton.addEventListener('click', () => {
  if(player.isPaused()) {
    togglePlayPause();
    player.play()
  } else {
    togglePlayPause();
    player.pause();
  }
});

prevButton.addEventListener('click', () => {
  if (playButton.classList.contains('play')) togglePlayPause();
  player.prev();
});

nextButton.addEventListener('click', () => {
  if (playButton.classList.contains('play')) togglePlayPause();
  player.next();
});

const audioTracks = Array.from(audioPlayer.querySelectorAll('audio'));
audioTracks.forEach(track => track.addEventListener('ended', () => player.next()));

function togglePlayPause() {
  playButton.classList.toggle('pause');
  playButton.classList.toggle('play');
}

// Slider buttons
sliderButtonLeft.addEventListener('click', e => body.style.backgroundImage = slider.changeSlide(body, -1));
sliderButtonRight.addEventListener('click', e => body.style.backgroundImage = slider.changeSlide(body, 1));

// Set time and date
showDateTime();

function showDateTime() {
  const getTimeOfDay = dateTime.getTimeOfDay(lang)
  const greetingTranslation = {
    EN: 'Good',
    RU: `${getGreeting()}`
  };

  dateBlock.textContent = dateTime.getDate(lang);
  timeBlock.textContent = dateTime.getTime(lang);
  greetingMessage.textContent = `${greetingTranslation[lang]} ${dateTime.getTimeOfDay(lang)},`;

  setTimeout(showDateTime, 1000);

  function getGreeting() {
    if (lang === 'RU') {
      switch (getTimeOfDay) {
        case 'утро': return 'Доброе';
        case  'день': return 'Добрый';
        case 'вечер': return 'Добрый';
        case 'ночь': return 'Доброй';
        default: 'Добрый';
      }
    }
  }
}

// Get weather
getLocalStorage();
showWeather(city.value, lang);
city.addEventListener('change', () => showWeather(city.value, lang));

function showWeather(city, lang) {
  const weatherTranslation = {
    EN: {
      wind: 'Wind speed',
      humidity: 'Humidity',
    },
    RU: {
      wind: 'Скорость ветра',
      humidity: 'Влажность',
    }
  }

  weather.getWeather(city, lang)
    .then(weather => {
      temperature.textContent = `${weather.temp} ℃`;
      clouds.textContent = weather.clouds;
      wind.textContent = `${weatherTranslation[lang].wind}: ${weather.wind} m/s`;
      humidity.textContent = `${weatherTranslation[lang].humidity}: ${weather.humidity}%`;
      weatherIcon.style.backgroundImage = `url(${weather.icon}`;
    })
    .catch(() => {
      weatherError.textContent = 'Invalid city name';
      temperature.textContent = null;
      clouds.textContent = null;
      wind.textContent = null;
      humidity.textContent = null;
      weatherIcon.style.backgroundImage = null;
    });
}

// Set quotes
showQuote();

quoteRefreshButton.addEventListener('click', () => {
  rotate(quoteRefreshButton, 180);
  showQuote();
})

function showQuote() {
  quotes.getQuote(lang).then(quote => {
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

// Settings
settingsButton.addEventListener('click', () => {
  popUpContainer.classList.add('visible');
  settingsPopUp.classList.add('visible');
})

popUpContainer.addEventListener('click', (e) => {
  if (e.target === popUpContainer){
    settingsPopUp.classList.remove('visible');
    popUpContainer.classList.remove('visible');
  }
})

blockSelectors.forEach(checkbox => {
  checkbox.addEventListener('input', () => {
    settings.toggleBlock(checkbox.name);
  })
});

languageSelector.addEventListener('change', () => {
  lang = languageSelector.value.toUpperCase();
  showDateTime();
  showWeather(city.value, lang);
  showQuote();
})