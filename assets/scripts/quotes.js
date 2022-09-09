export function getQuote(lang) {
    const src = `assets/files/quotes${lang}.json`;

    return fetch(src)
            .then(res => res.json())
            .then(data => {
                const arr = data['quotes'];
                const quote = arr[getRandomNumber(arr.length)];

                return quote;
            });
}

function getRandomNumber(max) {
    return Math.floor(Math.random() * max);
}