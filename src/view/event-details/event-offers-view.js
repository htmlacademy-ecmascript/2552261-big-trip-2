import {createElement} from '../../render';

function createEventOffersTemplate() {
  return '<section class="event__section  event__section--offers">\n' +
    '                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>\n' +
    '\n' +
    '                    <div class="event__available-offers">\n' +
    '                      <div class="event__offer-selector">\n' +
    '                        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>\n' +
    '                        <label class="event__offer-label" for="event-offer-luggage-1">\n' +
    '                          <span class="event__offer-title">Add luggage</span>\n' +
    '                          &plus;&euro;&nbsp;\n' +
    '                          <span class="event__offer-price">30</span>\n' +
    '                        </label>\n' +
    '                      </div>\n' +
    '\n' +
    '                      <div class="event__offer-selector">\n' +
    '                        <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" checked>\n' +
    '                        <label class="event__offer-label" for="event-offer-comfort-1">\n' +
    '                          <span class="event__offer-title">Switch to comfort class</span>\n' +
    '                          &plus;&euro;&nbsp;\n' +
    '                          <span class="event__offer-price">100</span>\n' +
    '                        </label>\n' +
    '                      </div>\n' +
    '\n' +
    '                      <div class="event__offer-selector">\n' +
    '                        <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal">\n' +
    '                        <label class="event__offer-label" for="event-offer-meal-1">\n' +
    '                          <span class="event__offer-title">Add meal</span>\n' +
    '                          &plus;&euro;&nbsp;\n' +
    '                          <span class="event__offer-price">15</span>\n' +
    '                        </label>\n' +
    '                      </div>\n' +
    '\n' +
    '                      <div class="event__offer-selector">\n' +
    '                        <input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-1" type="checkbox" name="event-offer-seats">\n' +
    '                        <label class="event__offer-label" for="event-offer-seats-1">\n' +
    '                          <span class="event__offer-title">Choose seats</span>\n' +
    '                          &plus;&euro;&nbsp;\n' +
    '                          <span class="event__offer-price">5</span>\n' +
    '                        </label>\n' +
    '                      </div>\n' +
    '\n' +
    '                      <div class="event__offer-selector">\n' +
    '                        <input class="event__offer-checkbox  visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer-train">\n' +
    '                        <label class="event__offer-label" for="event-offer-train-1">\n' +
    '                          <span class="event__offer-title">Travel by train</span>\n' +
    '                          &plus;&euro;&nbsp;\n' +
    '                          <span class="event__offer-price">40</span>\n' +
    '                        </label>\n' +
    '                      </div>\n' +
    '                    </div>\n' +
    '                  </section>';
}

export default class EventOffersView {
  getTemplate() {
    return createEventOffersTemplate();
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
