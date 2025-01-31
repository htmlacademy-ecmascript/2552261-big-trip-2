import dayjs from 'dayjs';

const newDate1 = '19/03/2019 10:04';
const newDate2 = '19/03/2019 10:34';

function parseDate(date) {
  const [day, month, year, hour, minute] = date.split(/\/|\s|:/);
  return new Date(Date.UTC(year, month - 1, day, hour, minute));
}

function getDate(date) {
  return new Date(date);
}

function getShortDate(date) {
  if (date instanceof Date) {
    const options = {month: 'short'};
    const monthName = date.toLocaleString('en-EN', options).toUpperCase();
    const dayNumber = date.getUTCDate().toString().padStart(2, '0');
    return `${monthName} ${dayNumber}`;
  }
}

function getShortTime(date) {
  if (date instanceof Date) {
    const hour = date.getUTCHours().toString().padStart(2, '0');
    const minute = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hour}:${minute}`;
  }
}

function getTimeDifference(date1, date2) {
  const dateJs1 = dayjs(parseDate(date1));
  const dateJs2 = dayjs(parseDate(date2));
  return `${dateJs2.diff(dateJs1, 'minute')}M`;
}

console.log(getShortTime(getDate('2019-07-10T22:55:56.845Z')));
console.log(getShortDate(getDate('2019-07-17T22:55:56.845Z')));
console.log(getTimeDifference(newDate1, newDate2));
console.log(getDate('2019-07-10T22:55:56.845Z'));
