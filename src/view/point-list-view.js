import {createElement} from '../render';

function createEventList() {
  return '<ul class="trip-events__list"></ul>';
}

export default class PointListView {
  getTemplate() {
    return createEventList();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
