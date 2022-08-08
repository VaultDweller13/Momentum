const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function getDate() {
    const date = new Date();
    // const dayOfWeek = days[date.getDay()];
    // const month = months[date.getMonth()];
    // const dayNumber = date.getDate();
    const options = { weekday: 'long', month: 'long', day: 'numeric' }

    // return `${dayOfWeek}, ${month} ${dayNumber}`;
    return date.toLocaleDateString('en-US', options);
}

export function getTime() {
    const date = new Date();
    // const hour = date.getHours().toString().padStart(2, '0');
    // const minutes = date.getMinutes().toString().padStart(2, '0');
    // const seconds = date.getSeconds().toString().padStart(2, '0');
    const options = {hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h24'};

    // return `${hour}:${minutes}:${seconds}`;
    return date.toLocaleTimeString('en-us', options);
}

export function getTimeOfDay() {
    const date = new Date();
    const hour = date.getHours();
    const minutes = date.getMinutes();

    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 24) return 'evening';
    if (hour >= 0 && hour < 6) return 'night';
}
