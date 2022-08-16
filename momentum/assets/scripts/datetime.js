const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function getDate(lang) {
    const date = new Date();
    // const dayOfWeek = days[date.getDay()];
    // const month = months[date.getMonth()];
    // const dayNumber = date.getDate();
    const options = { weekday: 'long', month: 'long', day: 'numeric'}

    // return `${dayOfWeek}, ${month} ${dayNumber}`;
    return date.toLocaleDateString(lang, options);
}

export function getTime(lang) {
    const date = new Date();
    // const hour = date.getHours().toString().padStart(2, '0');
    // const minutes = date.getMinutes().toString().padStart(2, '0');
    // const seconds = date.getSeconds().toString().padStart(2, '0');
    const options = {hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23'};

    // return `${hour}:${minutes}:${seconds}`;
    return date.toLocaleTimeString(lang, options);
}

export function getTimeOfDay(lang) {
    const date = new Date();
    const hour = date.getHours();
    const translation = {
        EN: {
            morning: 'morning',
            afternoon: 'afternoon',
            evening: 'evening',
            night: 'night'
        },
        RU: {
            morning: 'утро',
            afternoon: 'день',
            evening: 'вечер',
            night: 'ночи'
        }
    }

    if (hour >= 6 && hour < 12) return `${translation[lang].morning}`;
    if (hour >= 12 && hour < 18) return `${translation[lang].afternoon}`;
    if (hour >= 18 && hour < 24) return `${translation[lang].evening}`;
    if (hour >= 0 && hour < 6) return `${translation[lang].night}`;
}
