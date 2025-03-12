import AbstractView from '../framework/view/abstract-view';
import {changeFirstLetter} from '../utils/util';
import {SortType} from '../const';

function createListSortItemTemplate(sortTypes) {
  return sortTypes.map((sortType) => `<div class="trip-sort__item  trip-sort__item-${sortType.match(/-\w+/)}">
              <input id="${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${sortType}"
${sortType === 'sort-day' ? 'checked' : ''} ${(sortType === SortType.SORT_EVENT || sortType === SortType.SORT_OFFER) ? 'disabled' : ''}>
              <label class="trip-sort__btn" for="${sortType}">${changeFirstLetter(sortType.substring(sortType.indexOf('-') + 1, sortType.length))}</label>
            </div>`).join('');
}

function createListSortTemplate(sortTypes, pointListLength) {
  return `<form class="trip-events__trip-sort  trip-sort ${pointListLength === 0 ? 'visually-hidden' : ''}" action="#" method="get">
${createListSortItemTemplate(sortTypes)}
          </form>`;
}

export default class SortView extends AbstractView {
  #sortTypes = null;
  #handleSortTypeChange;
  #pointListLength;

  constructor({sortTypes, onSortTypeChange, pointListLength}) {
    super();
    this.#sortTypes = sortTypes;
    this.#handleSortTypeChange = onSortTypeChange;
    this.#pointListLength = pointListLength;
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createListSortTemplate(this.#sortTypes, this.#pointListLength);
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleSortTypeChange(evt.target.value);
  };
}
