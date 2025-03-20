import {formatString, changeFirstLetter} from '../utils/util';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {getTypeImage} from '../utils/point';
import flatpickr from 'flatpickr';
import {DateTime} from 'luxon';
import {setupUploadFormValidation} from '../validation';
import {formatDate} from '../utils/util';
import * as formUtil from '../utils/form';

function createEventTypeItem(types) {
  return types.map((type) => `<div class="event__type-item">
<input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === 'flight' ? 'checked' : ''}>
  <label class="event__type-label  event__type-label&#45;&#45;${type}" for="event-type-${type}-1">${changeFirstLetter(type)}</label>
 </div>`).join('');
}

function createEventDestinationItem(destinations) {
  return destinations.map((destination) => `<option value="${destination.name}">${destination.name}</option>`).join('');
}

function createEventHeaderTemplate({point, type, types, destination, destinations}) {

  const typeImage = type.image;
  const typeName = type.type;

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
${createEventTypeItem(types, point)}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${typeName}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination?.name ? destination.name : ''}" list="destination-list-1">
                    <datalist id="destination-list-1">
                    ${createEventDestinationItem(destinations)}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point?.basePrice ? point.basePrice : 0}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit" disabled>Save</button>
                  <button class="event__reset-btn" type="reset">Cancel</button>
                </header>`;
}

function createEventDestinationTemplate(destination) {
  const {description, pictures} = destination ? destination : {};
  const currentPictures = pictures ? pictures : [];
  const currentDescription = description ? description : '';

  return `<section class="event__section  event__section--destination" ${!destination || (pictures.length === 0 && description === '') ? 'hidden' : ''}>
                        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                        <p class="event__destination-description">${currentDescription}</p>

                       <div class="event__photos-container">
                         <div class="event__photos-tape">
                       ${createEventPhotoTemplate(currentPictures)}
                          </div>
                       </div>
                     </section>`;
}

function createEventPhotoTemplate(pictures = []) {
  return pictures.map(({src}) => `<img class="event__photo" src="${src}" alt="Event photo">`).join('');
}

function createOffersItemTemplate(offers, point) {
  return offers.map(({id, title, price}) => `<div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="event-${formatString(title)}" type="checkbox" name="event-${formatString(title)}" ${point.offers.some((offer) => offer === id) ? 'checked' : ''}>
                        <label class="event__offer-label" for="event-${formatString(title)}">
                          <span class="event__offer-title">${title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${price}</span>
                        </label>
                      </div>`).join('');
}

function createPointOffersTemplate(offers, point) {
  const currentOffers = offers;

  return `<section class="event__section  event__section--offers" ${currentOffers.length > 0 ? '' : 'hidden'}>
                       <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                       <div class="event__available-offers">
                        ${createOffersItemTemplate(currentOffers, point)}
                        </div>
                      </section>`;
}

function createPointEditTemplate({point, type, offers, destination, types, destinations}) {
  return `<li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
${createEventHeaderTemplate({point, type, types, destination, destinations})}
<section class="event__details">
${createPointOffersTemplate(offers, point)}
${createEventDestinationTemplate(destination)}
</section>
</form>
</li>`;
}

export default class PointFormAdd extends AbstractStatefulView {

  #destination;
  #offers;
  #types;
  #destinations;
  #handleFormSubmit;
  #handleFormClose;
  #handleEscKeyDown;
  #handleAddNewPointClick;
  #datepicker = null;
  #submitButton;
  #pristine;

  constructor({destination, offers, types, destinations, onFormSubmit, onCloseClick, onEscKeyDawn, onAddNewPointClick}) {
    super();
    this._setState({type: 'flight', offers: [], basePrice: 0});
    this.#destination = destination;
    this.#types = types;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClose = onCloseClick;
    this.#handleEscKeyDown = onEscKeyDawn;
    this.#handleAddNewPointClick = onAddNewPointClick;
    this.#offers = offers;
    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate({
      point: this._state,
      type: getTypeImage(this._state),
      offers: this.#getOffersByType(this._state.type),
      destination: this.#getDestinationById(this._state.destination),
      types: this.#types,
      destinations: this.#destinations
    });
  }

  _restoreHandlers() {
    this.#initPristine();
    this.#setDatepicker('event-start-time-1');
    this.#setDatepicker('event-end-time-1');
    this.#submitButton = this.element.querySelector('.event__save-btn');
    this.element.querySelector('.event__input--price').addEventListener('input', this.#pointPriceChangeHandler);
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#pointDestinationChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#pointOffersListChangeHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formClosetHandler);
  }

  #setDatepicker(element) {
    let defaultDate = null;
    if (element === 'event-start-time-1') {
      defaultDate = this?._state.dateFrom ? formatDate(this._state.dateFrom) : null;
    } else {
      defaultDate = this?._state.dateTo ? formatDate(this._state.dateTo) : null;
    }
    this.#datepicker = flatpickr(this.element.querySelector(`#${element}`),
      {
        enableTime: true,
        minDate: 'today',
        dateFormat: 'd/m/y H:i',
        defaultDate: defaultDate,
        onChange: this.#dueDateChangeHandler,
      },
    );
  }

  reset() {
    {
      this.updateElement({type: 'flight', destination: '', offers: [], basePrice: 0, dateFrom: '', dateTo: ''});
    }
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    const isValid = this.#pristine.validate();
    console.log(isValid);
    if (isValid) {
      console.log(this._state);
      this.#handleAddNewPointClick(this._state);
      formUtil.unblockSubmitButton(this.#submitButton);
      this.#handleFormClose();

    } else {
      formUtil.blockSubmitButton(this.#submitButton);
    }
  };

  #formClosetHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormClose();
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const update = {offers: []};
    this._setState(update);
    this.updateElement({type: evt.target.value});
    console.log(this._state); //TODO delete
  };

  #pointDestinationChangeHandler = (evt) => {
    evt.preventDefault();
    const isValid = this.#pristine.validate(evt.target);
    console.log(isValid);
    if (isValid || evt.target.value === '') {
      const newDestination = this.#destinations.find((destination) => destination.name === evt.target.value);
      this._setState({destination: newDestination});
      this.updateElement({destination: newDestination?.id ? newDestination.id : ''});
      formUtil.unblockSubmitButton(this.#submitButton);
      this.#initPristine();
    } else {
      this._setState({destination: {}}); //TODO DRY (дублирующий код)
      this.updateElement({destination: ''});
      this.#initPristine();
    }
  };

  #initPristine() {
    this.#pristine = setupUploadFormValidation(this.element.querySelector('.event--edit'), this.element.querySelector('.event__input--price'), this.element.querySelector('.event__input--destination'), this.element.querySelector('#event-end-time-1'), this.element.querySelector('#event-start-time-1'));
  }

  #pointPriceChangeHandler = (evt) => {
    const isValid = this.#pristine.validate(evt.target);
    if (isValid) {
      this._setState({basePrice: evt.target.value});
      formUtil.unblockSubmitButton(this.#submitButton);
    } else {
      formUtil.blockSubmitButton(this.#submitButton);
      this._setState({basePrice: 0});
    }
  };

  #pointOffersListChangeHandler = (evt) => {
    evt.preventDefault();
    const chosenOffer = this.#getOffersByType(this._state.type).find((offer) => offer.title.toLowerCase().replaceAll('-', ' ').includes(evt.target.name.replaceAll('-', ' ').match(/[^event\s][A-Za-z0-9\s]+/)[0])).id;
    if (this._state.offers.indexOf(chosenOffer) === -1) {
      const update = {offers: [chosenOffer, ...this._state.offers]};
      this._setState(update);
    } else {
      const update = {offers: [...this._state.offers]};
      update.offers.splice(update.offers.indexOf(chosenOffer), 1);
      this._setState(update);
    }
  };

  #getOffersByType(type) {
    return this.#offers.find((obj) => obj.type.localeCompare(type) === 0)?.offers;
  }

  #getDestinationById(id) {
    return this.#destinations.find((obj) => obj.id.localeCompare(id) === 0);
  }

  #dueDateChangeHandler = ([userDate], instance, event) => {
    const timezone = 'Europe/Moscow';
    const luxonDate = DateTime.fromJSDate(userDate).setZone(timezone);

    const isValidEndDate = this.#pristine.validate(this.element.querySelector('#event-end-time-1'));
    const isValidStartDate = this.#pristine.validate(this.element.querySelector('#event-start-time-1'));

    switch (event.input.name) {
      case 'event-start-time':
        if (isValidStartDate) {
          this._setState({dateFrom: luxonDate.toISO()});
        }
        break;
      case 'event-end-time':
        if (isValidEndDate) {
          this._setState({dateTo: luxonDate.toISO()});
          formUtil.unblockSubmitButton(this.#submitButton);
        } else {
          this._setState({dateTo: ''});
          this.element.querySelector('#event-end-time-1').value = '';
          formUtil.blockSubmitButton(this.#submitButton);
        }
        break;
    }
  };
}
