const DATA_LOAD_ERROR = 'Failed to load latest route information';

const FORM_TYPE = {
  EDIT: 'Edit',
  ADD: 'Add',
};

const URL = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
};

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

const MODE_FORM_ADD = {
  DEFAULT: 'CLOSE',
  OPEN: 'OPEN',
};

const SortType =
  {
    SORT_DAY: 'sort-day',
    SORT_EVENT: 'sort-event',
    SORT_TIME: 'sort-time',
    SORT_PRICE: 'sort-price',
    SORT_OFFER: 'sort-offer'
  };

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const SORT_TYPES = ['sort-day', 'sort-event', 'sort-time', 'sort-price', 'sort-offer'];

export {FilterType, Mode, SortType, SORT_TYPES, UserAction, UpdateType, MODE_FORM_ADD, URL, DATA_LOAD_ERROR, FORM_TYPE};
