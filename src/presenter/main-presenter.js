import SortView from '../view/sort-view';
import PointFormEdit from '../view/point-form-edit';
import PointListView from '../view/point-list-view';
import PointView from '../view/point-view';
import {render} from '../framework/render';
import {replace} from '../framework/render';

export default class MainPresenter {
  #pointListComponent = new PointListView();
  #container;
  #pointModel;
  #pointOptionsModel;
  #destinationModel;

  constructor(container, pointModel, pointOptionsModel, destinationModel) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#pointOptionsModel = pointOptionsModel;
    this.#destinationModel = destinationModel;
  }

  init() {
    this.points = this.#pointModel.getPoints();
    const types = this.#pointOptionsModel.getAllTypes();
    const destinations = this.#destinationModel.getDestinations();

    render(new SortView(), this.#container);
    render(this.#pointListComponent, this.#container);

    for (let i = 0; i < this.points.length; i++) {
      this.#renderPoint({types, destinations, index: i});
    }
  }

  #getTypeImage(points, index) {
    return {
      type: this.points[index].type,
      image: `img/icons/${this.points[index].type}.png`
    };
  }

  #renderPoint({types, destinations, index}) {
    const point = this.points[index];
    const type = this.#getTypeImage(this.points, index);
    const destination = this.#destinationModel.getDestinationById(this.points[index].destination);
    const offers = this.#pointOptionsModel.getOffersByType(this.points[index].type);
    const pointView = new PointView({point, type, destination, offers, onEditClick});
    const pointFormEdit = new PointFormEdit({
      point,
      type,
      destination,
      offers,
      types,
      destinations,
      onCloseClick,
      onFormSubmit
    });
    render(pointView, this.#pointListComponent.element);

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replace(pointView, pointFormEdit);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    function onEditClick() {
      replace(pointFormEdit, pointView);
      document.addEventListener('keydown', escKeyDownHandler);
    }

    function onCloseClick() {
      replace(pointView, pointFormEdit);
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    function onFormSubmit() {
      replace(pointView, pointFormEdit);
      document.removeEventListener('keydown', escKeyDownHandler);
    }
  }
}


