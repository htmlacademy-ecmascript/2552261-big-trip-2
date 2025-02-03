import {createElement} from '../../render';
import PointDetailsView from './point-details/point-details-view';
import PointHeaderView from './point-header-view';

function createPointEditTemplate() {
  return `<li class="trip-events__item"><form class="event event--edit" action="#" method="post"></form></li>`;
}

export default class PointFormView {
  eventDetails = new PointDetailsView();
  eventHeader = new PointHeaderView();

  getTemplate() {
    return createPointEditTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      this.element.firstElementChild.append(this.eventHeader.getElement());
      this.element.firstElementChild.append(this.eventDetails.getElement());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
