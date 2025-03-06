import {FilterType} from '../const';
import {getDate} from './util';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs(getDate(point.dateFrom)).isAfter(Date.now(), 'day')),
  [FilterType.PRESENT]: (points) => points.filter((point) => dayjs(getDate(point.dateFrom)).isSameOrBefore(Date.now(), 'day') &&
    dayjs(getDate(point.dateTo)).isSameOrAfter(Date.now(), 'day')),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs(getDate(point.dateTo)).isBefore(Date.now(), 'day'))
};

const FilterMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

export {filter, FilterMessage};
