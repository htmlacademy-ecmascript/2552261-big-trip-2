import PointFormEdit from '../view/point-form-edit';
import PointView from '../view/point-view';
import {render, replace} from '../framework/render';
import {remove} from '../framework/render';
import {Mode} from '../const';
import {getTypeImage} from '../utils/point';
import {UpdateType} from '../const';
import {UserAction} from '../const';

export default class PointPresenter {

  #pointListContainer = null;
  #prevFavoriteStatus = null;
  #pointFormEdit = null;
  #pointView = null;
  #point = null;
  #mode = Mode.DEFAULT;
  #handleDataChange;
  #handleModeChange;
  #resetFormAddPoint;
  #pointOptionsModel;
  #destinationModel;
  #types;
  #destinations;

  constructor({resetFormAddPoint, pointListContainer, onFavoritesChange, onModeChange, pointOptionsModel, destinationModel, types, destinations}) {
    this.#resetFormAddPoint = resetFormAddPoint;
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onFavoritesChange;
    this.#handleModeChange = onModeChange;
    this.#pointOptionsModel = pointOptionsModel;
    this.#destinationModel = destinationModel;
    this.#types = types;
    this.#destinations = destinations;
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
      onFormSubmit: this.#handleFormSubmit,
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

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointFormEdit.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
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

  #handleFormSubmit = () => {
    this.#replaceFormToPoint();
  };

  #handleFavoritesClick = () => {
    this.#point.isFavorite = !this.#point.isFavorite;
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      this.#point,
    );
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}
