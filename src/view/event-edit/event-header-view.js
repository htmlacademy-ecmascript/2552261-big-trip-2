import {createElement} from '../../render';

function createEventHeaderTemplate() {
  return '<header class="event__header">\n' +
    '                  <div class="event__type-wrapper">\n' +
    '                    <label class="event__type  event__type-btn" for="event-type-toggle-1">\n' +
    '                      <span class="visually-hidden">Choose event type</span>\n' +
    '                      <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">\n' +
    '                    </label>\n' +
    '                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">\n' +
    '\n' +
    '                    <div class="event__type-list">\n' +
    '                      <fieldset class="event__type-group">\n' +
    '                        <legend class="visually-hidden">Event type</legend>\n' +
    '\n' +
    '                        <div class="event__type-item">\n' +
    '                          <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">\n' +
    '                          <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>\n' +
    '                        </div>\n' +
    '\n' +
    '                        <div class="event__type-item">\n' +
    '                          <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">\n' +
    '                          <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>\n' +
    '                        </div>\n' +
    '\n' +
    '                        <div class="event__type-item">\n' +
    '                          <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">\n' +
    '                          <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>\n' +
    '                        </div>\n' +
    '\n' +
    '                        <div class="event__type-item">\n' +
    '                          <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">\n' +
    '                          <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>\n' +
    '                        </div>\n' +
    '\n' +
    '                        <div class="event__type-item">\n' +
    '                          <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">\n' +
    '                          <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>\n' +
    '                        </div>\n' +
    '\n' +
    '                        <div class="event__type-item">\n' +
    '                          <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>\n' +
    '                          <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>\n' +
    '                        </div>\n' +
    '\n' +
    '                        <div class="event__type-item">\n' +
    '                          <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">\n' +
    '                          <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>\n' +
    '                        </div>\n' +
    '\n' +
    '                        <div class="event__type-item">\n' +
    '                          <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">\n' +
    '                          <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>\n' +
    '                        </div>\n' +
    '\n' +
    '                        <div class="event__type-item">\n' +
    '                          <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">\n' +
    '                          <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>\n' +
    '                        </div>\n' +
    '                      </fieldset>\n' +
    '                    </div>\n' +
    '                  </div>\n' +
    '\n' +
    '                  <div class="event__field-group  event__field-group--destination">\n' +
    '                    <label class="event__label  event__type-output" for="event-destination-1">\n' +
    '                      Flight\n' +
    '                    </label>\n' +
    '                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Geneva" list="destination-list-1">\n' +
    '                    <datalist id="destination-list-1">\n' +
    '                      <option value="Amsterdam"></option>\n' +
    '                      <option value="Geneva"></option>\n' +
    '                      <option value="Chamonix"></option>\n' +
    '                    </datalist>\n' +
    '                  </div>\n' +
    '\n' +
    '                  <div class="event__field-group  event__field-group--time">\n' +
    '                    <label class="visually-hidden" for="event-start-time-1">From</label>\n' +
    '                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="19/03/19 00:00">\n' +
    '                    &mdash;\n' +
    '                    <label class="visually-hidden" for="event-end-time-1">To</label>\n' +
    '                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="19/03/19 00:00">\n' +
    '                  </div>\n' +
    '\n' +
    '                  <div class="event__field-group  event__field-group--price">\n' +
    '                    <label class="event__label" for="event-price-1">\n' +
    '                      <span class="visually-hidden">Price</span>\n' +
    '                      &euro;\n' +
    '                    </label>\n' +
    '                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">\n' +
    '                  </div>\n' +
    '\n' +
    '                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>\n' +
    '                  <button class="event__reset-btn" type="reset">Cancel</button>\n' +
    '                </header>';
}

export default class EventHeaderView {
  getTemplate() {
    return createEventHeaderTemplate();
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
