import {getDate} from './util';
import dayjs from 'dayjs';

function sortByDay(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
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

function getTypeImage(point) {
  return {
    type: point.type,
    image: `img/icons/${point.type}.png`
  };
}

export {sortByDay, sortByPrice, sortByTime, getTypeImage};

