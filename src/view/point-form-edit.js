import {formatDate, formatString, changeFirstLetter} from '../utils/util';
import AbstractView from '../framework/view/abstract-view';

function createEventTypeItem(types) {
  return types.map((type) => `<div class="event__type-item">
<input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
  <label class="event__type-label  event__type-label&#45;&#45;${type}" for="event-type-${type}-1">${changeFirstLetter(type)}</label>
 </div>`).join('');
}

function createEventDestinationItem(destinations) {
  return destinations.map((destination) => `<option value="${destination.name}">${destination.name}</option>`).join('');
}

function createEventHeaderTemplate({point, type, types, destination, destinations}) {

  const typeImage = type.image;
  const typeName = type.type;
  const dateFrom = formatDate(point.dateFrom);
  const dateTo = formatDate(point.dateTo);

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
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
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
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Cancel</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>`;
}

function createEventDestinationTemplate(destination) {
  const {description, pictures} = destination;
  const currentPictures = pictures;

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
  const currentOffers = offers;

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
${createEventHeaderTemplate({point, type, types, destination, destinations})}
<section class="event__details">
${createPointOffersTemplate(offers)}
${createEventDestinationTemplate(destination)}
</section>
</form>
</li>`;
}

export default class PointFormEdit extends AbstractView {

  #point;
  #type;
  #destination;
  #offers;
  #types;
  #destinations;
  #handleFormSubmit;
  #handleFormClose;

  constructor({point, type, destination, offers, types, destinations, onFormSubmit, onCloseClick}) {
    super();
    this.#point = point;
    this.#type = type;
    this.#destination = destination;
    this.#offers = offers;
    this.#types = types;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClose = onCloseClick;
    this.#offers = offers;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formClosetHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formClosetHandler);
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#formSubmitHandler);
  }

  get template() {
    return createPointEditTemplate({
      point: this.#point, type: this.#type,
      offers: this.#offers, destination: this.#destination, types: this.#types, destinations: this.#destinations
    });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
    this.#resetForm();
  };

  #formClosetHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormClose();
    this.#resetForm();
  };

  #resetForm() {
    this.element.querySelector('.event--edit').reset();
  }
}
