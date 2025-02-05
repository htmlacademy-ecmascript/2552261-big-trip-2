import {createElement} from '../../render';
import PointDetailsView from './point-details/point-details-view';
import PointHeaderView from './point-header/point-header-view';

function createPointEditTemplate() {
  return `<li class="trip-events__item"><form class="event event--edit" action="#" method="post"></form></li>`;
}

export default class PointFormView {

  constructor({point, type, destination, offers} = {}) {
    this.point = point;
    this.type = type;
    this.destination = destination;
    this.offers = offers;
  }

  eventDetails = new PointDetailsView();
  eventHeader = new PointHeaderView(this.point, this.type);

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
