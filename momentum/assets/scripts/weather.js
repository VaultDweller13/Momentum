const key = 'dd78fca7a4c44e2da151ed13848bf896';
const cityName = 'Minsk';

export async function getWeather() {
  const coords = await getCityCoordinats();

  if (!Array.isArray(coords)) {
    console.log('error');
    return 'error';
  }

  const weather = fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&appid=${key}`);
  weather.then(res => res.json()).then(data => console.log(data));
}

function getCityCoordinats() {
  const coords = [];
  const city = fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${key}`);

  return city.then(res => res.json()).then(data => [data[0].lat, data[0].lon]);
}