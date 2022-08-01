export function setBackground() {
  const timeOfDay = 'afternoon';
  const imageNumber = getRandomNumber(1, 21).toString().padStart(2, '0');
  const url = `https://raw.githubusercontent.com/VaultDweller13/stage1-tasks/assets/images/${timeOfDay}/${imageNumber}.jpg`

  return `url('${url}')`;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min); 
}