import {FilterType} from '../../const';
import {getDate} from './util';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => getDate(point.dateFrom) > Date.now()),
  [FilterType.PRESENT]: (points) => points.filter((point) => getDate(point.dateFrom).toString() === Date.now().toString()),
  [FilterType.PAST]: (points) => points.filter((point) => getDate(point.dateFrom) < Date.now()),
};

const FilterMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

export {filter, FilterMessage};
