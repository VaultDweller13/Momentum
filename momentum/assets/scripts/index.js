import * as slider from './slider.js';
import * as dateTime from './datetime.js';
import * as weather from './weather.js';
import * as quotes from './quotes.js';
import { AudioPlayer } from './audioPlayer.js'
import { playList } from './playList.js';

let state = {
  language: localStorage.lang || 'EN',
  photoSource: localStorage.photoSource || 'github',
  // blocks: localStorage.blocks || ['time', 'date', 'greeting', 'quote', 'weather', 'audio', 'todolist'],
  blocks: localStorage.blocks ?? ['time', 'date', 'greeting', 'quote', 'weather', 'audio'],

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
// const labelToDo = document.querySelector('.label-todo');
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
  const TimeOfDay = dateTime.getTimeOfDay(lang)
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
      switch (TimeOfDay) {
        case 'утро': return 'Доброе';
        case 'день': return 'Добрый';
        case 'вечер': return 'Добрый';
        case 'ночи': return 'Доброй';
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

blockSelectors.forEach(block => {
  block.addEventListener('change', () => {
    state.blocks = getWidgets();
  } );
});

function getWidgets() {
  return blockSelectors
    .filter(block => block.checked)
    .map(block => block.name);
}

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
    // labelToDo.textContent = 'Список дел';
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
    // labelToDo.textContent = 'To Do list';
  }

  photoSource.value = state.photoSource;

  if (photoSource.value === 'github') {
    labelTag.classList.add('hidden');
    tagInput.classList.add('hidden');
  } else {
    labelTag.classList.remove('hidden');
    tagInput.classList.remove('hidden');
  }

  blockSelectors.forEach(block => {
    const element = document.querySelector(`.${block.name}`);
    if (state.blocks.includes(block.name)) {
      block.checked = true;
      element.classList.contains('hidden') ? toggleBlock(block.name) : null;
    } else {
      block.checked = false;
      !element.classList.contains('hidden') ? toggleBlock(block.name) : null;
    }
  });
}


console.log(`Ваша оценка - 120 баллов 
Отзыв по пунктам ТЗ:
Не выполненные/не засчитанные пункты:
1) добавлен прогресс-бар в котором отображается прогресс проигрывания 

2) при перемещении ползунка прогресс-бара меняется текущее время воспроизведения трека 

3) над прогресс-баром отображается название трека 

4) отображается текущее и общее время воспроизведения трека 

5) есть кнопка звука при клике по которой можно включить/отключить звук 

6) добавлен регулятор громкости, при перемещении ползунка регулятора громкости меняется громкость проигрывания звука 

7) можно запустить и остановить проигрывания трека кликом по кнопке Play/Pause рядом с ним в плейлисте 

8) в качестве источника изображений может использоваться Unsplash API 

9) в качестве источника изображений может использоваться Flickr API 

10) ToDo List - список дел (как в оригинальном приложении) или Список ссылок (как в оригинальном приложении) или Свой собственный дополнительный функционал, по сложности аналогичный предложенным 

Выполненные пункты:
1) время выводится в 24-часовом формате, например: 21:01:00 

2) время обновляется каждую секунду - часы идут. Когда меняется одна из цифр, остальные при этом не меняют своё положение на странице (время не дёргается) 

3) выводится день недели, число, месяц, например: "Воскресенье, 16 мая" / "Sunday, May 16" / "Нядзеля, 16 траўня" 

4) текст приветствия меняется в зависимости от времени суток (утро, день, вечер, ночь). Проверяется соответствие приветствия текущему времени суток 

5) пользователь может ввести своё имя. При перезагрузке страницы приложения имя пользователя сохраняется 

6) ссылка на фоновое изображение формируется с учётом времени суток и случайного номера изображения (от 01 до 20). Проверяем, что при перезагрузке страницы фоновое изображение изменилось. Если не изменилось, перезагружаем страницу ещё раз 

7) изображения можно перелистывать кликами по стрелкам, расположенным по бокам экрана.Изображения перелистываются последовательно - после 18 изображения идёт 19 (клик по правой стрелке), перед 18 изображением идёт 17 (клик по левой стрелке) 

8) изображения перелистываются по кругу: после двадцатого изображения идёт первое (клик по правой стрелке), перед 1 изображением идёт 20 (клик по левой стрелке) 

9) при смене слайдов важно обеспечить плавную смену фоновых изображений. Не должно быть состояний, когда пользователь видит частично загрузившееся изображение или страницу без фонового изображения. Плавную смену фоновых изображений не проверяем: 1) при загрузке и перезагрузке страницы 2) при открытой консоли браузера 3) при слишком частых кликах по стрелкам для смены изображения 

10) при перезагрузке страницы приложения указанный пользователем город сохраняется, данные о нём хранятся в local storage 

11) для указанного пользователем населённого пункта выводятся данные о погоде, если их возвращает API. Данные о погоде включают в себя: иконку погоды, описание погоды, температуру в °C, скорость ветра в м/с, относительную влажность воздуха в %. Числовые параметры погоды округляются до целых чисел 

12) выводится уведомление об ошибке при вводе некорректных значений, для которых API не возвращает погоду (пустая строка или бессмысленный набор символов) 

13) при загрузке страницы приложения отображается рандомная цитата и её автор 

14) при перезагрузке страницы цитата обновляется (заменяется на другую). Есть кнопка, при клике по которой цитата обновляется (заменяется на другую) 

15) при клике по кнопке Play/Pause проигрывается первый трек из блока play-list, иконка кнопки меняется на Pause 

16) при клике по кнопке Play/Pause во время проигрывания трека, останавливается проигрывание трека, иконка кнопки меняется на Play 

17) треки пролистываются по кругу - после последнего идёт первый (клик по кнопке Play-next), перед первым - последний (клик по кнопке Play-prev) 

18) трек, который в данный момент проигрывается, в блоке Play-list выделяется стилем 

19) после окончания проигрывания первого трека, автоматически запускается проигрывание следующего. Треки проигрываются по кругу: после последнего снова проигрывается первый. 

20) переводится язык и меняется формат отображения даты 

21) переводится приветствие и placeholder 

22) переводится прогноз погоды в т.ч описание погоды и город по умолчанию 

23) переводится цитата дня т.е цитата отображается на текущем языке приложения. Сама цитата может быть другая 

24) переводятся настройки приложения, при переключении языка приложения в настройках, язык настроек тоже меняется 

25) в настройках приложения можно указать язык приложения (en/ru или en/be)  

26) в настройках приложения можно указать источник получения фото для фонового изображения: коллекция изображений GitHub, Unsplash API, Flickr API 

27) если источником получения фото указан API, в настройках приложения можно указать тег/теги, для которых API будет присылает фото 

28) в настройках приложения можно скрыть/отобразить любой из блоков, которые находятся на странице: время, дата, приветствие, цитата дня, прогноз погоды, аудиоплеер, список дел/список ссылок/ваш собственный дополнительный функционал 

29) Скрытие и отображение блоков происходит плавно, не влияя на другие элементы, которые находятся на странице, или плавно смещая их 

30) настройки приложения сохраняются при перезагрузке страницы 

`)