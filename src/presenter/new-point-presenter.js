import {Mode, MODE_FORM_ADD, UpdateType, UserAction} from '../const';
import PointFormAdd from '../view/point-form-add';
import {render} from '../framework/render';
import {remove} from '../framework/render';

export default class NewPointPresenter {
  #pointListContainer = null;
  #handleDataChange;
  #pointOptionsModel;
  #destinationModel;
  #types;
  #pointFormAdd;
  #formAddMode = MODE_FORM_ADD.DEFAULT;
  #addButton;

  constructor({
    pointListContainer,
    pointOptionsModel,
    destinationModel,
    handleDataChange,
    addButton,
    types
  }) {
    this.#pointListContainer = pointListContainer;
    this.#pointOptionsModel = pointOptionsModel;
    this.#destinationModel = destinationModel;
    this.#handleDataChange = handleDataChange;
    this.#addButton = addButton;
    this.#types = types;

  }

  init() {
    this.#formAddMode = MODE_FORM_ADD.OPEN;
    this.#pointFormAdd = new PointFormAdd({
      offers: this.#pointOptionsModel.getOptions(),
      types: this.#types,
      destinations: this.#destinationModel.getDestinations(),
      onFormSubmit: this.#handleAddSubmit,
      onCloseClick: this.#pointFormAddCloseHandler,
      onAddNewPointClick: this.#handleAddSubmit,
    });
    render(this.#pointFormAdd, this.#pointListContainer, 'afterbegin');
    document.addEventListener('keydown', this.#escKeyDownFormAddHandler);
    this.#addButton.disabled = true;
  }

  #handleAddSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #pointFormAddCloseHandler = () => {
    this.#closeFormAddPoint();
  };

  #escKeyDownFormAddHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#closeFormAddPoint();
    }
  };

  #closeFormAddPoint = () => {
    this.#pointFormAdd.reset();
    this.#pointListContainer.firstChild.remove();
    document.removeEventListener('keydown', this.#escKeyDownFormAddHandler);
    this.#addButton.disabled = false;
    this.#formAddMode = MODE_FORM_ADD.DEFAULT;
  };

  resetFormAddPoint = () => {
    if (this.#formAddMode !== MODE_FORM_ADD.DEFAULT) {
      this.#closeFormAddPoint();
    }
  };

  setSaving() {
    this.#pointFormAdd.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }
}

