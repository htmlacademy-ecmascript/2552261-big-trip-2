import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {getTypeImage} from '../utils/point';
import {setupUploadFormValidation} from '../validation';
import * as formUtil from '../utils/form';
import {changeDestination} from '../utils/form';

export default class PointFormAdd extends AbstractStatefulView {

  #destination;
  #offers;
  #types;
  #destinations;
  #handleFormSubmit;
  #handleFormClose;
  #handleEscKeyDown;
  #handleAddNewPointClick;
  #submitButton;
  #pristine;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({
    destination,
    offers,
    types,
    destinations,
    onFormSubmit,
    onCloseClick,
    onEscKeyDawn,
    onAddNewPointClick
  }) {
    super();
    this._setState({type: 'flight', offers: [], basePrice: 0, totalPrice: 0});
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
    return formUtil.createPointEditTemplate({
      point: this._state,
      type: getTypeImage(this._state),
      offers: formUtil.getOffersByType({type: this._state.type, offers: this.#offers}),
      destination: formUtil.getDestinationById({id: this._state.destination, destinations: this.#destinations}),
      types: this.#types,
      destinations: this.#destinations,
      formType: 'Add'
    });
  }

  _restoreHandlers() {
    this.#initPristine();
    this.#datepickerFrom = formUtil.setDatepicker({
      element: 'event-start-time-1',
      dueDateChangeHandler: this.#dueDateChangeHandler,
      inputElement: this.element
    });
    this.#datepickerTo = formUtil.setDatepicker({
      element: 'event-end-time-1',
      dueDateChangeHandler: this.#dueDateChangeHandler,
      inputElement: this.element
    });
    this.#submitButton = this.element.querySelector('.event__save-btn');
    this.element.querySelector('.event__input--price').addEventListener('input', this.#pointPriceChangeHandler);
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#pointDestinationChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#pointOffersListChangeHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formClosetHandler);
  }

  reset() {
    {
      this.updateElement({
        type: 'flight',
        destination: '',
        offers: [],
        basePrice: 0,
        totalPrice: 0,
        dateFrom: '',
        dateTo: ''
      });
    }
  }

  #initPristine() {
    this.#pristine = setupUploadFormValidation(this.#destinations, this.element.querySelector('.event--edit'), this.element.querySelector('.event__input--price'), this.element.querySelector('.event__input--destination'), this.element.querySelector('#event-end-time-1'), this.element.querySelector('#event-start-time-1'));
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._setState({basePrice: this._state.totalPrice});
    const isValid = this.#pristine.validate();
    if (isValid) {
      this.#handleAddNewPointClick(this._state);
      this.#handleFormClose();
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
  };

  #pointDestinationChangeHandler = (evt) => {
    this._setState({totalPrice: this._state.basePrice});
    changeDestination({
      evt,
      state: this._state,
      pristine: this.#pristine,
      destinations: this.#destinations,
      setState: this._setState.bind(this),
      updateElement: this.updateElement.bind(this),
      submitButton: this.#submitButton
    });
  };

  #pointPriceChangeHandler = (evt) => {
    formUtil.changePrice({
      evt,
      pristine: this.#pristine,
      submitButton: this.#submitButton,
      state: this._state,
      offers: this.#offers,
      setState: this._setState.bind(this)
    });
  };

  #pointOffersListChangeHandler = (evt) => {
    formUtil.changeOffers({evt, offers: this.#offers, state: this._state, setState: this._setState.bind(this)});
  };

  #dueDateChangeHandler = ([userDate], instance, event) => {
    formUtil.dueDateChange({
      userDate: [userDate],
      instance,
      event,
      pristine: this.#pristine,
      domElement: this.element,
      submitButton: this.#submitButton,
      setState: this._setState.bind(this),
      datepickerFrom: this.#datepickerFrom,
      datepickerTo: this.#datepickerTo
    });
  };
}
