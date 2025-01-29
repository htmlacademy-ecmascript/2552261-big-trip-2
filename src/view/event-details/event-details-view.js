import {createElement} from '../../render';
import EventOffersView from './event-offers-view';
import EventDestinationView from './event-destination-view';

function createEventDetailsTemplate() {
  return '<section class="event__details"></section>';
}

export default class EventDetailsView {
  eventOffers = new EventOffersView();
  eventDestination = new EventDestinationView();
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
