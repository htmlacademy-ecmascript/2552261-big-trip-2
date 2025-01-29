import {createElement} from '../../render';
import EventDetailsView from '../event-details/event-details-view';
import EventHeaderView from './event-header-view';

function createEventEditTemplate() {
  return '<form class="event event--edit" action="#" method="post"></form>';
}

export default class EventEditView {
  eventDetails = new EventDetailsView();
  eventHeader = new EventHeaderView();

  getTemplate() {
    return createEventEditTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      this.element.append(this.eventHeader.getElement());
      this.element.append(this.eventDetails.getElement());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
