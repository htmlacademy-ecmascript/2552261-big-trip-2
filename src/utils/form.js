import {changeFirstLetter, formatDateTimeZone, formatString} from './util';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';
import he from 'he';

function createEventTypeItem(types, point) {
  return types.map((type) => `<div class="event__type-item">
<input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${type === point.type ? 'checked' : ''}>
  <label class="event__type-label  event__type-label&#45;&#45;${type}" for="event-type-${type}-1">${changeFirstLetter(type)}</label>
 </div>`).join('');
}

function createEventDestinationItem(destinations) {
  return destinations.map((destination) => `<option value="${destination.name}">${destination.name}</option>`).join('');
}

function createEventHeaderTemplate({point, type, types, destination, destinations, formType}) {

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
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination?.name ? he.encode(destination.name) : ''}" list="destination-list-1">
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
                  <button class="event__reset-btn" type="reset">${formType === 'Edit' ? 'Delete' : 'Cancel'}</button>
                  ${formType === 'Edit' ? '<button class="event__rollup-btn" type="button">' : ''
  }
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

function createPointEditTemplate({point, type, offers, destination, types, destinations, formType}) {
  return `<li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
${createEventHeaderTemplate({point, type, types, destination, destinations, formType})}
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

const changeDestination = ({evt, pristine, destinations, state, setState, updateElement, submitButton}) => {
  evt.preventDefault();
  const isValid = pristine.validate(evt.target);

  if (isValid || evt.target.value === '') {
    const newDestination = destinations.find((destination) => destination.name.toLowerCase() === evt.target.value.toLowerCase());
    if (newDestination) {
      setState({destination: changeFirstLetter(newDestination.name), totalPrice: state.basePrice, offers: []});
      updateElement({destination: newDestination?.id ? newDestination.id : ''});
      unblockSubmitButton(submitButton);
    }
  }
};

const changePrice = ({evt, pristine, submitButton, state, offers, setState}) => {
  const isValid = pristine.validate(evt.target);
  if (isValid) {
    let totalPrice = evt.target.value;
    const currentOffers = getOffersByType({type: state.type, offers});
    state.offers.forEach((offer) => {
      totalPrice = getOffersById({id: offer, offers: currentOffers}).price + Number(totalPrice);
    });
    setState({basePrice: evt.target.value, totalPrice});
    unblockSubmitButton(submitButton);
  } else {
    blockSubmitButton(submitButton);
    setState({basePrice: 0, totalPrice: 0});
  }
};

const changeOffers = ({evt, offers, state, setState}) => {
  evt.preventDefault();
  let totalPrice;
  const chosenOffer = getOffersByType({
    type: state.type,
    offers
  }).find((offer) => offer.title.toLowerCase().replaceAll('-', ' ').includes(evt.target.name.replaceAll('-', ' ').match(/[^event\s][A-Za-z0-9\s]+/)[0]));

  if (state.offers.indexOf(chosenOffer.id) === -1) {
    totalPrice = Number(state.totalPrice) + chosenOffer.price;
    const update = {totalPrice, offers: [chosenOffer.id, ...state.offers]};
    setState(update);
  } else {
    totalPrice = Number(state.totalPrice) - chosenOffer.price;
    const update = {totalPrice, offers: [...state.offers]};
    update.offers.splice(update.offers.indexOf(chosenOffer.id), 1);
    setState(update);
  }
};

const setDatepicker = ({
  element,
  dueDateChangeHandler,
  inputElement
}) => flatpickr(inputElement.querySelector(`#${element}`),
  {
    enableTime: true,
    minDate: 'today',
    dateFormat: 'd/m/y H:i',
    onChange: dueDateChangeHandler,
  },
);

const dueDateChange = ({
  userDate,
  event,
  pristine,
  domElement,
  submitButton,
  setState,
  datepickerFrom,
  datepickerTo
}) => {
  const isValidStartDate = pristine.validate(domElement.querySelector('#event-start-time-1'));
  const isValidEndDate = pristine.validate(domElement.querySelector('#event-end-time-1'));

  switch (event.input.name) {
    case 'event-start-time':
      if (isValidStartDate) {
        setState({dateFrom: dayjs.utc(userDate).toISOString()});
        datepickerTo.set('minDate', new Date(userDate));
      }
      break;
    case 'event-end-time':
      if (isValidEndDate) {
        setState({dateTo: dayjs.utc(userDate).toISOString()});
        datepickerFrom.set('maxDate', new Date(userDate));
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

function getOffersById({id, offers}) {
  return offers.find((obj) => obj.id.localeCompare(id) === 0);
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
