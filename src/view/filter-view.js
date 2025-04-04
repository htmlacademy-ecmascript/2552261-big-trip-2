import AbstractView from '../framework/view/abstract-view';
import {filter} from '../utils/filter';

function createListFilterItemTemplate({filterType, currentFilterType, points}) {
  const pointsFilterLength = Object.entries(filter).filter(([type,]) => type === filterType.toLowerCase()).map(([, filterPoints]) => filterPoints(points).length);
  return `<div class="trip-filters__filter">
                  <input id="filter-${filterType.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterType.toLowerCase()}" ${filterType.toLowerCase() === currentFilterType.toLowerCase() ? 'checked' : ''} ${pointsFilterLength > 0 ? '' : 'disabled'}>
                  <label class="trip-filters__filter-label" for="filter-${filterType.toLowerCase()}">${filterType}</label>
                </div>`;
}

function createListFilterTemplate({filters, currentFilterType, points}) {
  return `<form class="trip-filters" action="#" method="get">
 ${Object.keys(filters).map((filterType) => createListFilterItemTemplate({
    filterType,
    currentFilterType,
    points
  })).join('')}
                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>`;
}

export default class FilterView extends AbstractView {
  #handleFilterChange;
  #currentFilterType;
  #filters;
  #points;

  constructor({
    filters, currentFilterType, onFilterTypeChange, points
  }) {
    super();
    this.#handleFilterChange = onFilterTypeChange;
    this.#currentFilterType = currentFilterType;
    this.#filters = filters;
    this.#points = points;
    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createListFilterTemplate({
      filters: this.#filters,
      currentFilterType: this.#currentFilterType,
      points: this.#points
    });
  }

  #filterChangeHandler = (evt) => {
    this.#handleFilterChange(evt);
  };
}
