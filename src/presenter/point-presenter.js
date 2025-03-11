import PointFormEdit from '../view/point-form-edit';
import PointView from '../view/point-view';
import {render, replace} from '../framework/render';
import {remove} from '../framework/render';
import {Mode} from '../const';
import {getTypeImage} from '../utils/point';

export default class PointPresenter {

  #pointListContainer = null;
  #prevFavoriteStatus = null;
  #pointFormEdit = null;
  #pointView = null;
  #point = null;
  #mode = Mode.DEFAULT;
  #handleDataChange;
  #handleModeChange;

  constructor({pointListContainer, onFavoritesChange, onModeChange}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onFavoritesChange;
    this.#handleModeChange = onModeChange;
  }

  init({point, types, destinations, destinationModel, pointOptionsModel}) {
    this.#point = point;
    const type = getTypeImage(this.#point);
    const destination = destinationModel.getDestinationById(this.#point.destination);
    const offers = pointOptionsModel.getOffersByType(this.#point.type);

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
      offers: pointOptionsModel.getOptions(),
      types,
      destinations,
      onCloseClick: this.#handleCloseClick,
      onFormSubmit: this.#handleFormSubmit
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
    this.#handleDataChange(this.#point);
  };
}
