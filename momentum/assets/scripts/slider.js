export function setBackground(imageIndex = null) {
  const timeOfDay = 'afternoon';
  const imageNumber = imageIndex ? imageIndex : getRandomNumber(1, 21).toString().padStart(2, '0');

  return `url(https://raw.githubusercontent.com/VaultDweller13/stage1-tasks/assets/images/${timeOfDay}/${imageNumber}.jpg)`;
}

export function changeSlide(element, offset) {
  let urlArr = element.style.backgroundImage.split('/');
  let slideNumber = +urlArr[urlArr.length - 1].split('.')[0] + offset;

  slideNumber = slideNumber < 1 ? 20 : slideNumber > 20 ? 1 : slideNumber;  

  return setBackground(slideNumber.toString().padStart(2, '0'));
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min); 
}