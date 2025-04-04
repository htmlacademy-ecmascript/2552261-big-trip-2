import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {getTypeImage} from '../utils/point';
import 'flatpickr/dist/flatpickr.min.css';
import {setupUploadFormValidation} from '../validation';
import {changeFirstLetter, formatDateTimeZone, formatString} from '../utils/util';
import {getOffersByType} from '../utils/offer';
import {getDestinationById} from '../utils/destination';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';
import he from 'he';
import {FORM_TYPE} from '../const';

function createEventTypeItem(types, point) {
  return types.map((type) => `<div class="event__type-item">
<input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === point.type ? 'checked' : ''}>
  <label class="event__type-label  event__type-label&#45;&#45;${type}" for="event-type-${type}-1">${changeFirstLetter(type)}</label>
 </div>`).join('');
}

function createEventDestinationItem(destinations) {
  return destinations.map((destination) => `<option value="${destination.name}">${destination.name}</option>`).join('');
}

function createButtonLabel(formType, isDeleting) {
  if (formType === 'Edit') {
    return isDeleting ? 'Deleting...' : 'Delete';
  }
  return 'Cancel';
}

function createEventHeaderTemplate({point, type, types, destination, destinations, formType, isSaving, isDeleting, isDisabled}) {

  const typeImage = type.image;
  const typeName = type.type;
  const dateFrom = point?.dateFrom !== undefined ? formatDateTimeZone(point.dateFrom) : '';
  const dateTo = point?.dateTo !== undefined ? formatDateTimeZone(point.dateTo) : '';

  return `<header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src=${typeImage} alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

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
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination?.name ? he.encode(destination.name) : ''}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
                    <datalist id="destination-list-1">
                    ${createEventDestinationItem(destinations)}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFrom}" ${isDisabled ? 'disabled' : ''}>
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateTo}" ${isDisabled ? 'disabled' : ''}>
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice}" ${isDisabled ? 'disabled' : ''}>
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
                  <button class="event__reset-btn" type="reset" >${createButtonLabel(formType, isDeleting)}</button>
                  ${formType === 'Edit' ? '<button class="event__rollup-btn" type="button" ><span class="visually-hidden">Open event</span></button>' : ''
}

                </header>`;
}

function createEventDestinationTemplate(destination) {
  const {description, pictures} = destination ? destination : [];
  const currentPictures = pictures ? pictures : [];
  const currentDescription = description ? description : '';

  if((currentDescription !== '' || currentPictures.length > 0)) {
    return `<section class="event__section  event__section--destination"}>
                        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                        <p class="event__destination-description">${currentDescription}</p>

                    ${createPhotoContainer(currentPictures)}
                     </section>`;
  } else {
    return '';
  }

}

function createEventPhotoTemplate(pictures = []) {
  return pictures.map(({src}) => `<img class="event__photo" src="${src}" alt="Event photo">`).join('');
}

function createPhotoContainer(currentPictures) {
  if(currentPictures.length > 0) {
    return `    <div class="event__photos-container">
                         <div class="event__photos-tape">
                       ${createEventPhotoTemplate(currentPictures)}
                          </div>
                       </div>`;
  } else {
    return '';
  }
}

function createOffersItemTemplate(offers, point, isDisabled) {
  return offers.map(({id, title, price}) => `<div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="event-${formatString(title)}" type="checkbox" name="event-${formatString(title)}"   ${point.offers.some((offer) => offer === id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
                        <label class="event__offer-label" for="event-${formatString(title)}">
                          <span class="event__offer-title">${title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${price}</span>
                        </label>
                      </div>`).join('');
}

function createPointOffersTemplate(offers, point, isDisabled) {
  const currentOffers = offers;
  if(currentOffers.length > 0) {
    return `<section class="event__section  event__section--offers" }>
                       <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                       <div class="event__available-offers">
                        ${createOffersItemTemplate(currentOffers, point, isDisabled)}
                        </div>
                      </section>`;
  }
}

function createPointEditTemplate({point, type, offers, destination, types, destinations, formType, isSaving, isDeleting, isDisabled}) {
  return `<li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
${createEventHeaderTemplate({point, type, types, destination, destinations, formType, isSaving, isDeleting, isDisabled})}
<section class="event__details">
${offers.length > 0 ? createPointOffersTemplate(offers, point, isDisabled) : ''}
${destination ? createEventDestinationTemplate(destination) : ''}
</section>
</form>
</li>`;
}

export default class PointFormEdit extends AbstractStatefulView {

  #destination;
  #offers;
  #types;
  #destinations;
  #handleFormSubmit;
  #handleFormClose;
  #handleDeleteClick;
  #pristine;
  #submitButton;
  #datepickerFrom = null;
  #datepickerTo = null;
  #formType;

  constructor({point, destination, offers, types, destinations, onFormSubmit, onCloseClick, onDeleteClick, formType}) {
    super();
    this._setState(point ? PointFormEdit.parsePointToState(point) : PointFormEdit.parsePointToState({type: 'flight', offers: [], basePrice: 0}));
    this.#destination = destination;
    this.#types = types;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClose = onCloseClick;
    this.#handleDeleteClick = onDeleteClick ? onDeleteClick : null;
    this.#offers = offers;
    this.#formType = formType;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate({
      point: this._state,
      type: getTypeImage(this._state),
      offers: getOffersByType({type: this._state.type, offers: this.#offers}),
      destination: getDestinationById({id: this._state.destination, destinations: this.#destinations}),
      types: this.#types,
      destinations: this.#destinations,
      formType: this.#formType,
      isSaving: this._state.isSaving,
      isDeleting: this._state.isDeleting,
      isDisabled: this._state.isDisabled
    });
  }

  _restoreHandlers() {
    this.#datepickerFrom = this.#setDatepicker({
      element: 'event-start-time-1',
      dueDateChangeHandler: this.#dueDateChangeHandler,
      inputElement: this.element
    });
    this.#datepickerTo = this.#setDatepicker({
      element: 'event-end-time-1',
      dueDateChangeHandler: this.#dueDateChangeHandler,
      inputElement: this.element
    });
    this.#initPristine();
    this.#submitButton = this.element.querySelector('.event__save-btn');
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#formClosetHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#pointDestinationChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#pointOffersListChangeHandler);
    if(this.#formType === FORM_TYPE.EDIT) {
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    } else {
      this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formClosetHandler);
    }
    this.element.querySelector('.event__input--price').addEventListener('input', this.#pointPriceChangeHandler);
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  }

  #initPristine() {
    this.#pristine = setupUploadFormValidation(this.#destinations, this.element.querySelector('.event--edit'), this.element.querySelector('.event__input--price'), this.element.querySelector('.event__input--destination'), this.element.querySelector('#event-end-time-1'), this.element.querySelector('#event-start-time-1'));
  }

  static parsePointToState(point) {
    return {
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
      ...point,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }

  #pointDestinationChangeHandler = (evt) => {
    evt.preventDefault();
    const isValid = this.#pristine.validate(evt.target);
    if (isValid || evt.target.value === '') {
      const newDestination = this.#destinations.find((destination) => destination.name.toLowerCase() === evt.target.value.toLowerCase());
      if (newDestination) {
        this._setState({destination: changeFirstLetter(newDestination.name)});
        this.updateElement({destination: newDestination?.id ? newDestination.id : ''});
      } else {
        this._setState({destination: ''});
      }
    }
  };

  #pointPriceChangeHandler = (evt) => {
    const isValid = this.#pristine.validate(evt.target);
    if (isValid) {
      this._setState({basePrice: Number(evt.target.value)});
    } else {
      this._setState({basePrice: Number(0)});
    }
  };

  #pointOffersListChangeHandler = (evt) => {
    evt.preventDefault();
    const chosenOffer = getOffersByType({
      type: this._state.type,
      offers: this.#offers
    }).find((offer) => offer.title.toLowerCase().replaceAll('-', ' ').includes(evt.target.name.replaceAll('-', ' ').match(/[^event\s][A-Za-z0-9\s]+/)[0]));

    if (this._state.offers.indexOf(chosenOffer.id) === -1) {
      const update = {offers: [chosenOffer.id, ...this._state.offers]};
      this._setState(update);
    } else {
      const update = {offers: [...this._state.offers]};
      update.offers.splice(update.offers.indexOf(chosenOffer.id), 1);
      this._setState(update);
    }
  };

  #setDatepicker = ({
    element,
    dueDateChangeHandler,
    inputElement
  }) => flatpickr(inputElement.querySelector(`#${element}`),
    {
      enableTime: true,
      minDate: 'today',
      'time_24hr': true,
      dateFormat: 'd/m/y H:i',
      onChange: dueDateChangeHandler,
    },
  );

  #dueDateChangeHandler = ([userDate], instance, event) => {
    if(userDate !== undefined) {
      switch (event.input.name) {
        case 'event-start-time':
          this._setState({dateFrom: dayjs.utc(userDate).toISOString()});
          this.#datepickerTo.set('minDate', new Date(userDate));
          break;
        case 'event-end-time':
          this._setState({dateTo: dayjs.utc(userDate).toISOString()});
          this.#datepickerFrom.set('maxDate', new Date(userDate));
          break;
      }
    }
  };

  reset(point) {
    if (point) {
      this.updateElement(
        PointFormEdit.parsePointToState(point),
      );
    } else {
      this.updateElement({
        type: 'flight',
        destination: '',
        offers: [],
        basePrice: 0,
        dateFrom: '',
        dateTo: ''
      });
    }
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._setState({initialPrice: this._state.basePrice});
    this.#handleFormSubmit(PointFormEdit.parseStateToPoint(this._state));
  };

  #formClosetHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormClose();
    this.#resetForm();
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const update = {offers: []};
    this._setState(update);
    this.updateElement({type: evt.target.value});
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    if(this.#handleDeleteClick) {
      this.#handleDeleteClick(this._state);
    }
  };

  #resetForm() {
    this.element.querySelector('.event--edit').reset();
  }
}
