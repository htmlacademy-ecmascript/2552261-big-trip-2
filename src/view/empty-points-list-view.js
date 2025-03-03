import {FilterMessage} from '../utils/filter';
import AbstractView from '../framework/view/abstract-view';


function createEmptyPointList(filterType) {
  const message = Object.entries(FilterMessage).filter(([type,]) => type === filterType)
    .map(([, filterMessage]) => filterMessage);
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class EmptyList extends AbstractView {
  constructor(filterType = {}) {
    super();
    this.filterType = filterType;
  }

  get template() {
    return createEmptyPointList(this.filterType);
  }
}
