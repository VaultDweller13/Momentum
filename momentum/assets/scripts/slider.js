const unsplashKey ='pPRP0B5yczGaO6vkwpyN-pgy2hJEQ_6UBMs0NON5-4I';
let currentImageIndex;
let currentImagesArray;
let currentSource;
let currentQuery;

export async function getBackgroundImage(source, query, imageIndex) {
  const imagesArray = await getImages(source, query);
  const imageNumber = imageIndex ?? getRandomNumber(0, imagesArray.length);
  currentImageIndex = imageNumber;
  currentImagesArray = imagesArray;
  currentSource = source;
  currentQuery = query;

  return imagesArray[imageNumber];
}

export function next() {
  const length = currentImagesArray.length
  return currentImageIndex + 1 >= length ? 0 : currentImageIndex + 1;
}

export function prev() {
  const length = currentImagesArray.length
  return currentImageIndex - 1 < 0 ? length - 1 : currentImageIndex - 1;
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min); 
}

export function getImages(source, query) {
  const photoAPI = {
    unsplash: `https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=${unsplashKey}`,
  }

  if (source === 'github') {
    const images = [];

    for(let i = 1; i < 21; i++) {
      const imageNumber = i.toString().padStart(2, '0');
      images.push(`https://raw.githubusercontent.com/VaultDweller13/stage1-tasks/assets/images/${query}/${imageNumber}.jpg`)
    }
    return images;
  }

  if (source === 'flickr') {
    return fetchFlickr(query);
  }
  
  return fetch(photoAPI[source])
    .then(res => res.json())
    .then(data => {
      return data.results.map(item => item.urls.regular);
    });
}

export async function fetchFlickr(query) {
  const flickrKey ='35e6180608930bbaefa70302798699ac';
  const url = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flickrKey}&tags=${query}&format=json&nojsoncallback=1`

  const data = await (await fetch(url)).json();
  const propsArray = data.photos.photo;
  return propsArray.map(constructURL)

  function constructURL(props) {
    const serverId = props.server;
    const id = props.id;
    const secret = props.secret;
    const sizeSuffix = 'b';

    return `https://live.staticflickr.com/${serverId}/${id}_${secret}_${sizeSuffix}.jpg`;
  }
}
