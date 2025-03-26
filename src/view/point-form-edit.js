import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {getTypeImage} from '../utils/point';
import 'flatpickr/dist/flatpickr.min.css';
import {setupUploadFormValidation} from '../validation';
import * as formUtil from '../utils/form';
import {changeDestination} from '../utils/form';

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

  constructor({point, destination, offers, types, destinations, onFormSubmit, onCloseClick, onDeleteClick}) {
    super();
    this._setState(PointFormEdit.parsePointToState(point));
    this.#destination = destination;
    this.#types = types;
    this.#destinations = destinations;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClose = onCloseClick;
    this.#handleDeleteClick = onDeleteClick;
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
      formType: 'Edit',
      isSaving: this._state.isSaving,
      isDeleting: this._state.isDeleting,
      isDisabled: this._state.isDisabled
    });
  }

  _restoreHandlers() {
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
    this.#initPristine();
    this.#submitButton = this.element.querySelector('.event__save-btn');
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#formClosetHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#pointDestinationChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#pointOffersListChangeHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#pointPriceChangeHandler);
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  }

  #initPristine() {
    this.#pristine = setupUploadFormValidation(this.#destinations, this.element.querySelector('.event--edit'), this.element.querySelector('.event__input--price'), this.element.querySelector('.event__input--destination'), this.element.querySelector('#event-end-time-1'), this.element.querySelector('#event-start-time-1'));
  }

  static parsePointToState(point) {
    return {
      totalPrice: point.basePrice,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
      ...point,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};
    delete point.totalPrice;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }

  reset(point) {
    {
      this.updateElement(
        PointFormEdit.parsePointToState(point),
      );
    }
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._setState({basePrice: this._state.totalPrice});
    if (this._state.totalPrice < 0) {
      this.element.querySelector('.event__input--price').value = this._state.totalPrice;
    }
    const isValid = this.#pristine.validate();
    if (isValid) {
      this.#handleFormSubmit(PointFormEdit.parseStateToPoint(this._state));
    }
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

  #pointDestinationChangeHandler = (evt) => {
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

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(this._state);
  };

  #resetForm() {
    this.element.querySelector('.event--edit').reset();
  }
}
