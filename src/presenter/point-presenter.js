import PointFormEdit from '../view/point-form-edit';
import PointView from '../view/point-view';
import {remove, render, replace} from '../framework/render';
import {Mode, MODE_FORM_ADD, UpdateType, UserAction} from '../const';
import {getTypeImage} from '../utils/point';
import PointFormAdd from '../view/point-form-add';

export default class PointPresenter {

  #pointListContainer = null;
  #prevFavoriteStatus = null;
  #pointFormEdit = null;
  #pointView = null;
  #point = null;
  #mode = Mode.DEFAULT;
  #handleDataChange;
  #handleModeChange;
  #pointOptionsModel;
  #destinationModel;
  #types;
  #destinations;
  static #editButton;
  static #pointFormAdd;
  static #formAddMode = MODE_FORM_ADD.DEFAULT;
  static #handlePointAddClick;

  constructor({
    pointListContainer,
    onFavoritesChange,
    onModeChange,
    pointOptionsModel,
    destinationModel,
    types,
    destinations,
    onAddClick
  }) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onFavoritesChange;
    this.#handleModeChange = onModeChange;
    this.#pointOptionsModel = pointOptionsModel;
    this.#destinationModel = destinationModel;
    this.#types = types;
    this.#destinations = destinations;
    if (!PointPresenter.#editButton && !PointPresenter.#pointFormAdd) {
      PointPresenter.#editButton = document.querySelector('.trip-main__event-add-btn');
      PointPresenter.#editButton.addEventListener('click', this.#pointAddClickHandler);
      PointPresenter.#pointFormAdd = new PointFormAdd({
        offers: this.#pointOptionsModel.getOptions(),
        types: this.#types,
        destinations: this.#destinations,
        onCloseClick: this.#pointFormAddCloseHandler,
        onAddNewPointClick: this.#handleAddSubmit
      });
      PointPresenter.#handlePointAddClick = onAddClick;
    }
  }

  init({point}) {
    this.#point = point;
    const type = getTypeImage(this.#point);
    const destination = this.#destinationModel.getDestinationById(this.#point.destination);
    const offers = this.#pointOptionsModel.getOffersByType(this.#point.type);

    const prevPointView = this.#pointView;
    const prevPointEdit = this.#pointFormEdit;

    this.#pointView = new PointView({
      point: this.#point,
      type,
      destination,
      offers,
      onEditClick: this.#handleEditClick,
      onFavoritesClick: this.#handleFavoritesClick
    });

    this.#pointFormEdit = new PointFormEdit({
      point,

      destination,
      offers: this.#pointOptionsModel.getOptions(),
      types: this.#types,
      destinations: this.#destinations,
      onCloseClick: this.#handleCloseClick,
      onFormSubmit: this.#handleEditSubmit,
      onDeleteClick: this.#handleDeleteClick
    });

    if (prevPointView === null || prevPointEdit === null) {
      render(this.#pointView, this.#pointListContainer);
      this.#prevFavoriteStatus = this.#point.isFavorite;
      return;
    }

    if (this.#point.isFavorite !== this.#prevFavoriteStatus) {
      replace(this.#pointView, prevPointView);
      this.#prevFavoriteStatus = this.#point.isFavorite;
    }
  }

  #replacePointToForm() {
    replace(this.#pointFormEdit, this.#pointView);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointView, this.#pointFormEdit);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #resetFormAddPoint = () => {
    if (PointPresenter.#formAddMode !== MODE_FORM_ADD.DEFAULT) {
      this.#closeFormAddPoint();
    }
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointFormEdit.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointFormEdit.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  destroy() {
    remove(this.#pointView);
    remove(this.#pointFormEdit);
  }

  #handleEditClick = () => {
    this.#resetFormAddPoint();
    this.#replacePointToForm();
  };

  #handleCloseClick = () => {
    this.#pointFormEdit.reset(this.#point);
    this.#replaceFormToPoint();
  };

  #handleEditSubmit = (point) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleFavoritesClick = () => {
    this.#point.isFavorite = !this.#point.isFavorite;
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      this.#point,
    );
  };

  #handleDeleteClick = () => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      this.#point,
    );
  };

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
    PointPresenter.#pointFormAdd.reset();
    this.#pointListContainer.firstChild.remove();
    document.removeEventListener('keydown', this.#escKeyDownFormAddHandler);
    PointPresenter.#editButton.disabled = false;
    PointPresenter.#formAddMode = MODE_FORM_ADD.DEFAULT;
  };

  #pointAddClickHandler = () => {
    PointPresenter.#handlePointAddClick();
    PointPresenter.#formAddMode = MODE_FORM_ADD.OPEN;
    render(PointPresenter.#pointFormAdd, this.#pointListContainer, 'afterbegin');
    document.addEventListener('keydown', this.#escKeyDownFormAddHandler);
    PointPresenter.#editButton.disabled = true;
  };


  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#pointFormEdit.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointFormEdit.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }
}
