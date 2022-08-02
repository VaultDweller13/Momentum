import * as slider from './slider.js';

const body = document.querySelector('body');
const main = document.querySelector('main');
const sliderButtonLeft = main.querySelector('.left');
const sliderButtonRight = main.querySelector('.right');

body.style.backgroundImage = slider.setBackground();

sliderButtonLeft.addEventListener('click', e => body.style.backgroundImage = slider.changeSlide(body, -1));
sliderButtonRight.addEventListener('click', e => body.style.backgroundImage = slider.changeSlide(body, 1));

