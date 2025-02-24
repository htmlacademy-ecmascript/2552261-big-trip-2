import {createElement} from '../render';
import {formatDate, formatString, changeFirstLetter} from '../util';

function createEventTypeItem(types) {
  return types.map((type) => `<div class="event__type-item">
<input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
  <label class="event__type-label  event__type-label&#45;&#45;${type}" for="event-type-${type}-1">${changeFirstLetter(type)}</label>
 </div>`).join('');
}

function createEventDestinationItem(destinations) {
  return destinations.map((destination) => `<option value="${destination.name}">${destination.name}</option>`).join('');
}

function createEventHeaderTemplate({point, type, types, destinations}) {

  const typeImage = type?.image || 'img/icons/flight.png';
  const typeName = type?.name || 'Flight';
  const dateFrom = point?.dateFrom ? formatDate(point.dateFrom) : formatDate('2019-03-19T00:00:00.000Z');
  const dateTo = point?.dateTo ? formatDate(point.dateTo) : formatDate('2019-03-19T00:00:00.000Z');

  return `<header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src=${typeImage} alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
${createEventTypeItem(types)}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${typeName}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Geneva" list="destination-list-1">
                    <datalist id="destination-list-1">
                    ${createEventDestinationItem(destinations)}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point?.basePrice || ''}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Cancel</button>
                </header>`;
}

function createEventDestinationTemplate(destination) {
  const {description, pictures} = destination || {};
  const currentPictures = pictures || [
    {src: 'img/photos/1.jpg'},
    {src: 'img/photos/2.jpg'},
    {src: 'img/photos/3.jpg'},
    {src: 'img/photos/4.jpg'},
    {src: 'img/photos/5.jpg'},
  ];

  const currentDescription = description || 'Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.';

  return `<section class="event__section  event__section--destination">
                        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                        <p class="event__destination-description">${currentDescription}</p>

                       <div class="event__photos-container">
                         <div class="event__photos-tape">
                       ${createEventPhotoTemplate(currentPictures)}
                          </div>
                       </div>
                     </section>`;
}

function createEventPhotoTemplate(pictures) {
  return pictures.map(({src}) => `<img class="event__photo" src="${src}" alt="Event photo">`).join('');
}

function createOffersItemTemplate(offers) {
  return offers.map(({title, price}) => `<div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="event-${formatString(title)}" type="checkbox" name="event-${formatString(title)}">
                        <label class="event__offer-label" for="event-${formatString(title)}">
                          <span class="event__offer-title">${title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${price}</span>
                        </label>
                      </div>`).join('');
}

function createPointOffersTemplate(offers) {
  const currentOffers = offers || [
    {
      title: 'Add luggage',
      price: 30
    },
    {
      title: 'Switch to comfort class',
      price: 100
    },
    {
      title: 'Add meal',
      price: 15
    },
    {
      title: 'Choose seats',
      price: 5
    },
    {
      title: 'Travel by train',
      price: 40
    }
  ];

  return `<section class="event__section  event__section--offers">
                       <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                       <div class="event__available-offers">
                        ${createOffersItemTemplate(currentOffers)}
                        </div>
                      </section>`;
}

function createPointEditTemplate({point, type, offers, destination, types, destinations}) {
  return `<li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
${createEventHeaderTemplate({point, type, types, destinations})}
<section class="event__details">
${createEventDestinationTemplate(destination)}
${createPointOffersTemplate(offers)}
</section>
</form>
</li>`;
}

export default class PointFormView {

  constructor({point, type, destination, offers, types, destinations} = {}) {
    if (point && type && destination && offers && types) {
      this.point = point;
      this.type = type;
      this.destination = destination;
      this.offers = offers;
      this.types = types;
    } else {
      this.types = types;
      this.destinations = destinations;
    }
  }

  getTemplate() {
    return createPointEditTemplate({
      point: this.point, type: this.type,
      offers: this.offers, destination: this.destination, types: this.types, destinations: this.destinations
    });
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
