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
  #datepicker = null;

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
      destinations: this.#destinations
    });
  }

  _restoreHandlers() {
    formUtil.setDatepicker({
      element: 'event-start-time-1',
      datepicker: this.#datepicker,
      dueDateChangeHandler: this.#dueDateChangeHandler,
      state: this._state,
      inputElement: this.element
    });
    formUtil.setDatepicker({
      element: 'event-end-time-1',
      datepicker: this.#datepicker,
      dueDateChangeHandler: this.#dueDateChangeHandler,
      state: this._state,
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
    this.#pristine = setupUploadFormValidation(this.element.querySelector('.event--edit'), this.element.querySelector('.event__input--price'), this.element.querySelector('.event__input--destination'), this.element.querySelector('#event-end-time-1'), this.element.querySelector('#event-start-time-1'));
  }

  static parsePointToState(point) {
    return {
      ...point,
    };
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
    const isValid = this.#pristine.validate();
    if (isValid) {
      this.#handleFormSubmit(this._state);
      this.#resetForm();
    } else {
      formUtil.blockSubmitButton(this.#submitButton);
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
    changeDestination(evt, this.#pristine, this.#destinations, this._setState.bind(this), this.updateElement.bind(this), this.#submitButton);
    const isValid = this.#pristine.validate(evt.target);
    if (!isValid) {
      formUtil.blockSubmitButton(this.#submitButton);
    }
  };

  #pointPriceChangeHandler = (evt) => {
    formUtil.changePrice({evt, pristine: this.#pristine, submitButton: this.#submitButton, setState: this._setState.bind(this)});
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
      setState: this._setState.bind(this)
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
