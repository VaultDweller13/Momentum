import * as slider from './slider.js';
import * as dateTime from './datetime.js';
import * as weather from './weather.js';
import * as quotes from './quotes.js';
import { AudioPlayer } from './audioPlayer.js'
import { playList } from './playList.js';

let state = {
  language: localStorage.lang || 'EN',
  photoSource: localStorage.photoSource || 'github',
  blocks: ['time', 'date', 'greeting', 'quote', 'weather', 'audio', 'todolist'],
}

let lang = state.language;

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
const labelLanguage = document.querySelector('.label-language');
const labelPhoto = document.querySelector('.label-photo');
const labelTag = document.querySelector('.label-tag');
const labelTime = document.querySelector('.label-time');
const labelDate = document.querySelector('.label-date');
const labelGreeting = document.querySelector('.label-greeting');
const labelQuote = document.querySelector('.label-quote');
const labelWeather = document.querySelector('.label-weather');
const labelAudio = document.querySelector('.label-audio');
const labelToDo = document.querySelector('.label-todo');
const legendWidgets = document.querySelector('.legend-widgets');
const photoSource = document.querySelector('.photo-select');
const tagInput = document.querySelector('.input-tag'); 

// Set local storage
window.addEventListener('beforeunload', setLocalStorage);
window.addEventListener('load', getLocalStorage);

function setLocalStorage() {
  localStorage.setItem('city', city.value);
  localStorage.setItem('user', userName.value);
  localStorage.setItem('lang', state.language);
  localStorage.setItem('photoSrc', state.photoSource);
  localStorage.setItem('blocks', state.blocks);
}

function getLocalStorage() {
  if (localStorage.getItem('city')) {
    city.value = localStorage.getItem('city');
  }

  if (localStorage.getItem('user')) {
    userName.value = localStorage.getItem('user');
  }

  if (localStorage.getItem('lang')) {
    state.language = localStorage.getItem('lang');
  }

  if (localStorage.getItem('photoSrc')) {
    state.photoSource = localStorage.getItem('photoSrc');
  }

  if (localStorage.getItem('blocks')) {
    state.blocks = localStorage.getItem('blocks').split(',');
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

  userName.placeholder = lang === 'RU' ? '[Введите свое имя]' : '[Enter your name]';
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
city.defaultValue = lang === 'RU' ? 'Минск' : 'Minsk'; 
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
      weatherError.textContent = null;
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
populateSettings();
settingsButton.addEventListener('click', () => {
  popUpContainer.classList.add('visible');
  settingsPopUp.classList.add('visible');
});

popUpContainer.addEventListener('click', (e) => {
  if (e.target === popUpContainer){
    settingsPopUp.classList.remove('visible');
    popUpContainer.classList.remove('visible');
  }
});

blockSelectors.forEach(checkbox => {
  checkbox.addEventListener('input', () => {
    toggleBlock(checkbox.name);
  });
});

languageSelector.value = state.language.toLowerCase();
languageSelector.addEventListener('change', changeLanguage);

photoSource.addEventListener('change', () => {
  state.photoSource = photoSource.value;

  if (photoSource.value === 'github') {
    labelTag.classList.add('hidden');
    tagInput.classList.add('hidden');
  } else {
    labelTag.classList.remove('hidden');
    tagInput.classList.remove('hidden');
  }
});

function toggleBlock(block) {
  const element = document.querySelector(`.${block}`);
  element.classList.toggle('hidden');
}

function changeLanguage() {
  state.language = languageSelector.value.toUpperCase();
  lang = state.language;
  showDateTime();
  showWeather(city.value, lang);
  showQuote();
  populateSettings();
}

function populateSettings() {
  if (lang === 'RU') {
    labelLanguage.textContent = 'Язык';
    labelPhoto.textContent = 'Источник фото';
    labelTag.textContent = 'Тэг:';
    legendWidgets.textContent = 'Виджеты';
    labelTime.textContent = 'Время';
    labelDate.textContent = 'Дата';
    labelGreeting.textContent = 'Приветствие';
    labelQuote.textContent = 'Цитата';
    labelWeather.textContent = 'Погода';
    labelAudio.textContent = 'Аудио';
    labelToDo.textContent = 'Список дел';
  }

  if (lang === 'EN') {
    labelLanguage.textContent = 'Language';
    labelPhoto.textContent = 'Photo source';
    labelTag.textContent = 'Tag:';
    legendWidgets.textContent = 'Widgets';
    labelTime.textContent = 'Time';
    labelDate.textContent = 'Date';
    labelGreeting.textContent = 'Greeting';
    labelQuote.textContent = 'Quote';
    labelWeather.textContent = 'Weather';
    labelAudio.textContent = 'Audio';
    labelToDo.textContent = 'To Do list';
  }

  photoSource.value = state.photoSource;

  if (photoSource.value === 'github') {
    labelTag.classList.add('hidden');
    tagInput.classList.add('hidden');
  } else {
    labelTag.classList.remove('hidden');
    tagInput.classList.remove('hidden');
  }

}
