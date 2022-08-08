export function setBackground(element, timeOfDay, imageIndex) {
  const imageNumber = imageIndex ? imageIndex : getRandomNumber(1, 21).toString().padStart(2, '0');
  const url = `https://raw.githubusercontent.com/VaultDweller13/stage1-tasks/assets/images/${timeOfDay}/${imageNumber}.jpg`;
  let img = new Image();
  img.src = url;

  img.addEventListener('load', () => {
    element.style.backgroundImage = `url(${img.src})`;
    img = null;
  });
}

export function changeSlide(element, offset) {
  const pathArray = element.style.backgroundImage.split('/');
  const imageNumber = pathArray.slice(-1)[0];
  const timeOfDay =  pathArray.slice(-2, -1);
  let slideNumber = +imageNumber.split('.')[0] + offset;

  slideNumber = slideNumber < 1 ? 20 : slideNumber > 20 ? 1 : slideNumber;  

  return setBackground(element, timeOfDay, slideNumber.toString().padStart(2, '0'));
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min); 
}