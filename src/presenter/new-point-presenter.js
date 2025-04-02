import {FilterType, MODE_FORM_ADD, UpdateType, UserAction} from '../const';
import PointFormAdd from '../view/point-form-add';
import {remove, render} from '../framework/render';

export default class NewPointPresenter {
  #pointListContainer = null;
  #handleDataChange;
  #renderEmptyList;
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
    renderEmptyList,
    addButton,
    types
  }) {
    this.#pointListContainer = pointListContainer;
    this.#pointOptionsModel = pointOptionsModel;
    this.#destinationModel = destinationModel;
    this.#handleDataChange = handleDataChange;
    this.#renderEmptyList = renderEmptyList;
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

  destroy() {
    remove(this.#pointFormAdd);
    this.#addButton.disabled = false;
  }

  #handleAddSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
    this.#formAddMode = MODE_FORM_ADD.DEFAULT;
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
    remove(this.#pointFormAdd);
    document.removeEventListener('keydown', this.#escKeyDownFormAddHandler);
    this.#addButton.disabled = false;
    this.#formAddMode = MODE_FORM_ADD.DEFAULT;
    if(this.#pointListContainer.children.length === 0) {
      this.#renderEmptyList(FilterType.EVERYTHING);
    }
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

  setAborting() {
    const resetFormState = () => {
      this.#pointFormAdd.updateElement({
        isDisabled: false,
        isSaving: false,
        basePrice: this.#pointFormAdd._state.initialPrice,
      });
    };
    this.#formAddMode = MODE_FORM_ADD.OPEN;
    this.#pointFormAdd.shake(resetFormState);
  }
}

