import * as slider from './slider.js';
import * as dateTime from './datetime.js';

const body = document.querySelector('body');
const main = document.querySelector('main');
const sliderButtonLeft = main.querySelector('.left');
const sliderButtonRight = main.querySelector('.right');
const dateBlock = main.querySelector('.date');
const timeBlock = main.querySelector('.time');
const greetingBlock = main.querySelector('.greeting-message');

// Set background
body.style.backgroundImage = slider.setBackground(dateTime.getTimeOfDay());

// Set time and date
dateBlock.textContent = dateTime.getDate();
timeBlock.textContent = dateTime.getTime();
greetingBlock.textContent = `Good ${dateTime.getTimeOfDay()},`;

// Slider buttons
sliderButtonLeft.addEventListener('click', e => body.style.backgroundImage = slider.changeSlide(body, -1));
sliderButtonRight.addEventListener('click', e => body.style.backgroundImage = slider.changeSlide(body, 1));

