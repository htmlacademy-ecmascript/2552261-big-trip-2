import {Mode, MODE_FORM_ADD, UpdateType, UserAction} from '../const';
import PointFormAdd from '../view/point-form-add';
import {render} from '../framework/render';

export default class NewPointPresenter {
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
  #editButton;
  #pointFormAdd;
  #formAddMode = MODE_FORM_ADD.DEFAULT;
  #handlePointAddClick;

  constructor(pointListContainer,
    onFavoritesChange,
    onModeChange,
    pointOptionsModel,
    destinationModel,
    types,
    destinations,
    onAddClick) {
    this.#editButton = document.querySelector('.trip-main__event-add-btn');
    this.#editButton.addEventListener('click', this.#pointAddClickHandler);
    this.#pointFormAdd = new PointFormAdd({
      offers: this.#pointOptionsModel.getOptions(),
      types: this.#types,
      destinations: this.#destinations,
      onCloseClick: this.#pointFormAddCloseHandler,
      onAddNewPointClick: this.#handleAddSubmit
    });
    this.#handlePointAddClick = onAddClick;
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
    this.#editButton.disabled = false;
    this.#formAddMode = MODE_FORM_ADD.DEFAULT;
  };

  #pointAddClickHandler = () => {
    this.#handlePointAddClick();
    this.#formAddMode = MODE_FORM_ADD.OPEN;
    render(this.#pointFormAdd, this.#pointListContainer, 'afterbegin');
    document.addEventListener('keydown', this.#escKeyDownFormAddHandler);
    this.#editButton.disabled = true;
  };
}
