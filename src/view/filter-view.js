import AbstractView from '../framework/view/abstract-view';

function createListFilterItemTemplate({filterType, currentFilterType}) {
  return `<div class="trip-filters__filter">
                  <input id="filter-${filterType.toLowerCase()}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterType.toLowerCase()}" ${filterType.toLowerCase() === currentFilterType.toLowerCase() ? 'checked' : ''}>
                  <label class="trip-filters__filter-label" for="filter-${filterType.toLowerCase()}">${filterType}</label>
                </div>`;
}

function createListFilterTemplate({filters, currentFilterType}) {
  return `<form class="trip-filters" action="#" method="get">
 ${Object.keys(filters).map((filterType) => createListFilterItemTemplate({filterType, currentFilterType})).join('')}
                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>`;
}

export default class FilterView extends AbstractView {
  #handleFilterChange;
  #currentFilterType;
  #filters;

  constructor({
    filters, currentFilterType, onFilterTypeChange
  }) {
    super();
    this.#handleFilterChange = onFilterTypeChange;
    this.#currentFilterType = currentFilterType;
    this.#filters = filters;
    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createListFilterTemplate({filters: this.#filters, currentFilterType: this.#currentFilterType});
  }

  #filterChangeHandler = (evt) => {
    this.#handleFilterChange(evt);
  };
}
