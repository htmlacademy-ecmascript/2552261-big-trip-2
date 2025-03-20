import {changeFirstLetter, formatDateTimeZone, formatString} from './util';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';

function createEventTypeItem(types, point) {
  return types.map((type) => `<div class="event__type-item">
<input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === point.type ? 'checked' : ''}>
  <label class="event__type-label  event__type-label&#45;&#45;${type}" for="event-type-${type}-1">${changeFirstLetter(type)}</label>
 </div>`).join('');
}

function createEventDestinationItem(destinations) {
  return destinations.map((destination) => `<option value="${destination.name}">${destination.name}</option>`).join('');
}

function createEventHeaderTemplate({point, type, types, destination, destinations}) {

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
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
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
                        <input class="event__offer-checkbox  visually-hidden" id="event-${formatString(title)}" type="checkbox" name="event-${formatString(title)}"   ${point.offers.some((offer) => offer === id) ? 'checked' : ''}>
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

function blockSubmitButton(button) {
  button.disabled = true;
}

function unblockSubmitButton(button) {
  button.disabled = false;
}

const changeDestination = (evt, pristine, destinations, setState, updateElement, submitButton) => {
  evt.preventDefault();
  const isValid = pristine.validate(evt.target);

  if (isValid || evt.target.value === '') {
    const newDestination = destinations.find((destination) => destination.name === evt.target.value);
    setState({destination: newDestination});
    updateElement({destination: newDestination?.id ? newDestination.id : ''});
    unblockSubmitButton(submitButton);
  } else {
    setState({destination: {}});
    updateElement({destination: ''});
  }
};

const changePrice = ({evt, pristine, submitButton, setState}) => {
  const isValid = pristine.validate(evt.target);
  if (isValid) {
    setState({basePrice: evt.target.value});
    unblockSubmitButton(submitButton);
  } else {
    blockSubmitButton(submitButton);
    setState({basePrice: 0});
  }
};

const changeOffers = ({evt, offers, state, setState}) => {
  evt.preventDefault();
  const chosenOffer = getOffersByType({
    type: state.type,
    offers
  }).find((offer) => offer.title.toLowerCase().replaceAll('-', ' ').includes(evt.target.name.replaceAll('-', ' ').match(/[^event\s][A-Za-z0-9\s]+/)[0])).id;
  if (state.offers.indexOf(chosenOffer) === -1) {
    const update = {offers: [chosenOffer, ...state.offers]};
    setState(update);
  } else {
    const update = {offers: [...state.offers]};
    update.offers.splice(update.offers.indexOf(chosenOffer), 1);
    setState(update);
  }
};

const setDatepicker = ({element, datepicker, dueDateChangeHandler, inputElement}) => {
  datepicker = flatpickr(inputElement.querySelector(`#${element}`),
    {
      enableTime: true,
      minDate: 'today',
      dateFormat: 'd/m/y H:i',
      onChange: dueDateChangeHandler,
    },
  );
  return datepicker;
};

const dueDateChange = ({userDate, event, pristine, domElement, submitButton, setState}) => {
  const isValidEndDate = pristine.validate(domElement.querySelector('#event-end-time-1'));
  const isValidStartDate = pristine.validate(domElement.querySelector('#event-start-time-1'));
  switch (event.input.name) {
    case 'event-start-time':
      if (isValidStartDate) {
        setState({dateFrom: dayjs.utc(userDate).toISOString()});
      }
      break;
    case 'event-end-time':
      if (isValidEndDate) {
        setState({dateTo: dayjs.utc(userDate).toISOString()});
        unblockSubmitButton(submitButton);
      } else {
        setState({dateTo: ''});
        domElement.querySelector('#event-end-time-1').value = '';
        blockSubmitButton(submitButton);
      }
      break;
  }
};

function getOffersByType({type, offers}) {
  return offers.find((obj) => obj.type.localeCompare(type) === 0)?.offers;
}

function getDestinationById({id, destinations}) {
  return destinations.find((obj) => obj.id.localeCompare(id) === 0);
}


export {
  blockSubmitButton,
  unblockSubmitButton,
  changeDestination,
  changePrice,
  changeOffers,
  getOffersByType,
  getDestinationById,
  createPointEditTemplate,
  setDatepicker,
  dueDateChange
};
