const FilterType =
  {
    EVERYTHING: 'everything',
    FUTURE: 'future',
    PRESENT: 'present',
    PAST: 'past'
  };

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const SortType =
  {
    SORT_DAY: 'sort-day',
    SORT_EVENT: 'sort-event',
    SORT_TIME: 'sort-time',
    SORT_PRICE: 'sort-price',
    SORT_OFFER: 'sort-offer'
  };

const SORT_TYPES = ['sort-day', 'sort-event', 'sort-time', 'sort-price', 'sort-offer'];

export {FilterType, Mode, SortType, SORT_TYPES};
