import SortView from '../view/sort-view';
import PointFormEdit from '../view/point-form-edit';
import PointListView from '../view/point-list-view';
import PointView from '../view/point-view';
import {render} from '../framework/render';
import {replace} from '../framework/render';
import TripInfoView from '../view/trip-info-view';
import FilterView from '../view/filter-view';
import {filter} from '../utils/filter';
import EmptyList from '../view/empty-points-list-view';
import {FilterType} from '../../const';

export default class MainPresenter {
  #pointListComponent = new PointListView();
  #emptyList = new EmptyList();
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
    const mainContainer = this.#container.querySelector('.trip-events');
    const headerContainer = this.#container.querySelector('.trip-main');

    render(new TripInfoView(), headerContainer, 'afterbegin');
    render(new FilterView(this.onFilterChange), headerContainer.querySelector('.trip-controls__filters'));
    render(new SortView(), mainContainer);
    render(this.#pointListComponent, mainContainer);
    this.#renderPointList({points: this.points, types, destinations});
  }

  #getTypeImage(point) {
    return {
      type: point.type,
      image: `img/icons/${point.type}.png`
    };
  }

  #renderPointList({filterType = FilterType.EVERYTHING, points, types, destinations}) {
    if (points.length > 0) {
      points.forEach((point) => this.#renderPoint({point, types, destinations}));
    } else {
      render(new EmptyList(filterType), this.#container.querySelector('.trip-events'));
    }
  }

  #renderPoint({point, types, destinations}) {
    const type = this.#getTypeImage(point);
    const destination = this.#destinationModel.getDestinationById(point.destination);
    const offers = this.#pointOptionsModel.getOffersByType(point.type);
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

  onFilterChange = (evt) => {
    if (evt.target.name === 'trip-filter') {

      this.#clearPointList();
      this.#clearFilterMessage();

      render(this.#pointListComponent, this.#container.querySelector('.trip-events'));

      const types = this.#pointOptionsModel.getAllTypes();
      const destinations = this.#destinationModel.getDestinations();
      const points = Object.entries(filter).filter(([filterType,]) =>
        filterType === evt.target.value).map(([, filterPoints]) => filterPoints(this.#pointModel.getPoints())).flat();

      this.#renderPointList({filterType: evt.target.value, points, types, destinations});

    }
  };

  #clearPointList() {
    if (document.querySelector('.trip-events__list')) {
      document.querySelector('.trip-events__list').remove();
      this.#pointListComponent.removeElement();
    }
  }

  #clearFilterMessage() {
    if (document.querySelector('.trip-events__msg')) {
      document.querySelector('.trip-events__msg').remove();
      this.#emptyList.removeElement();
    }
  }
}


