import AbstractView from '../framework/view/abstract-view';
import {FilterType} from '../const';

function createListFilterItemTemplate(filterType) {
  return `<div class="trip-filters__filter">
                  <input id="filter-${filterType.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterType.toLowerCase()}" ${filterType.toLowerCase() === 'everything' ? 'checked' : ''}>
                  <label class="trip-filters__filter-label" for="filter-${filterType.toLowerCase()}">${filterType}</label>
                </div>`;
}

function createListFilterTemplate() {
  return `<form class="trip-filters" action="#" method="get">
 ${Object.keys(FilterType).map((filterType) => createListFilterItemTemplate(filterType)).join('')}
                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>`;
}

export default class FilterView extends AbstractView {
  #handleFilterChange;

  constructor(onChange) {
    super();
    this.#handleFilterChange = onChange;
    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createListFilterTemplate();
  }

  #filterChangeHandler = (evt) => {
    this.#handleFilterChange(evt);
  };
}
