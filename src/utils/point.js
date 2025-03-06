import {getDate} from './util';
import dayjs from 'dayjs';

function sortByDay(pointA, pointB) {
  return getDate(pointA.dateFrom) - getDate(pointB.dateFrom);
}

function sortByPrice(pointA, pointB) {
  return Math.sign(pointB.basePrice - pointA.basePrice);
}

function sortByTime(pointA, pointB) {
  const pointAdateFrom = dayjs(getDate(pointA.dateFrom));
  const pointAdateTo = dayjs(getDate(pointA.dateTo));
  const pointBdateFrom = dayjs(getDate(pointB.dateFrom));
  const pointBdateTo = dayjs(getDate(pointB.dateTo));

  return pointBdateTo.diff(pointBdateFrom, 'minute') - pointAdateTo.diff(pointAdateFrom, 'minute');
}

export {sortByDay, sortByPrice, sortByTime};

