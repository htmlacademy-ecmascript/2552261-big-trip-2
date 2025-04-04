import {FilterMessage} from '../utils/filter';
import AbstractView from '../framework/view/abstract-view';
import {DATA_LOAD_ERROR} from '../const';


function createEmptyPointList(filterType) {
  if (filterType.length > 0) {
    const message = Object.entries(FilterMessage).filter(([type,]) => type === filterType)
      .map(([, filterMessage]) => filterMessage);
    return `<p class="trip-events__msg">${message}</p>`;
  }
  return `<p class="trip-events__msg">${DATA_LOAD_ERROR}</p>`;
}

export default class EmptyListView extends AbstractView {
  constructor(filterType = {}) {
    super();
    this.filterType = filterType;
  }

  get template() {
    return createEmptyPointList(this.filterType);
  }
}
