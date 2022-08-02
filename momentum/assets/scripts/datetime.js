const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const date = new Date();

export function getDate() {
    const dayOfWeek = days[date.getDay()];
    const month = months[date.getMonth()];
    const dayNumber = date.getDate();

    return `${dayOfWeek}, ${month} ${dayNumber}`;
}

export function getTime() {
    const hour = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${hour}:${minutes}:${seconds}`;
}

export function getTimeOfDay() {
    const hour = date.getHours();
    const minutes = date.getMinutes();

    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 24) return 'evening';
    if (hour >= 0 && hour < 6) return 'night';
}
