import {createElement} from '../../../render';
import PointOffersView from './point-offers-view';
import PointDestinationView from './point-destination-view';

function createEventDetailsTemplate() {
  return '<section class="event__details"></section>';
}

export default class PointDetailsView {
  eventOffers = new PointOffersView();
  eventDestination = new PointDestinationView();
  getTemplate() {
    return createEventDetailsTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      this.element.append(this.eventOffers.getElement());
      this.element.append(this.eventDestination.getElement());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
