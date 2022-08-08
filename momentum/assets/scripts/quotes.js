export function getQuote() {
    const src = 'assets/files/quotes.json';

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