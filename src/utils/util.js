import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);


function parseDate(date) {
  const [day, month, year, hour, minute] = date.split(/\/|\s|:/);
  return new Date(Date.UTC(year, month - 1, day, hour, minute));
}

function formatDate(date) {
  return dayjs.tz(date,'Europe/Moscow').format('YY/MM/DD HH:mm');
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
  const dateJs1 = dayjs(date1);
  const dateJs2 = dayjs(date2);
  const diffInMinutes = dateJs2.diff(dateJs1, 'minutes');
  if(diffInMinutes < 60) {
    return `${dateJs2.diff(dateJs1, 'minutes')}M`;
  } else if (dateJs2.diff(dateJs1, 'day') < 1) {
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    return `${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  } else {
    const days = Math.floor(diffInMinutes / (60 * 24));
    const hours = Math.floor(((diffInMinutes - (days * 24 * 60)) / 60));
    const minutes = diffInMinutes % 60;
    return `${days.toString().padStart(2, '0')}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M`;
  }
}

function formatString(str) {
  return str.toLowerCase().replaceAll(' ', '-');
}

function changeFirstLetter(string) {
  return string.replace(/^\w/, string.charAt(0).toUpperCase());
}

export {parseDate, getDate, getTimeDifference, getShortTime, getShortDate, formatDate, formatString, changeFirstLetter};
