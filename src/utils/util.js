import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

function formatDateTimeZone(date) {
  return dayjs.tz(date,'Europe/Moscow').format('DD/MM/YY HH:mm');
}

function formatDate(date) {
  return dayjs(date).format('DD/MM/YY HH:mm');
}

function getDate(date) {
  return new Date(date);
}

function getShortDate(date) {
  if (date instanceof Date) {
    return dayjs(date).format('MMM DD');
  }
}

function getShortTime(date) {
  if (date instanceof Date) {
    return dayjs.utc(date).format('HH:mm');
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

export {getDate, getTimeDifference, getShortTime, getShortDate, formatDateTimeZone, formatString, changeFirstLetter, formatDate};
