import PointPresenter from './point-presenter';
import PointListView from '../view/point-list-view';
import EmptyListView from '../view/empty-points-list-view';
import TripInfoView from '../view/trip-info-view';
import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import {updateItem} from '../utils/common';
import {render} from '../framework/render';
import {RenderPosition} from '../framework/render';
import {FilterType} from '../const';
import {filter} from '../utils/filter';
import {SORT_TYPES} from '../const';

export default class MainPresenter {
  #pointListComponent = new PointListView();
  #pointPresenters = new Map();
  #emptyList = new EmptyListView();
  #container;
  #mainContainer;
  #headerContainer;
  #pointModel;
  #pointOptionsModel;
  #destinationModel;

  constructor(container, pointModel, pointOptionsModel, destinationModel) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#pointOptionsModel = pointOptionsModel;
    this.#destinationModel = destinationModel;
    this.#mainContainer = this.#container.querySelector('.trip-events');
    this.#headerContainer = this.#container.querySelector('.trip-main');
  }

  init() {
    this.points = [...this.#pointModel.getPoints()];
    const types = this.#pointOptionsModel.getAllTypes();
    const destinations = this.#destinationModel.getDestinations();

    this.#renderPointBoard({
      types,
      destinations,
      mainContainer: this.#mainContainer,
      headerContainer: this.#headerContainer
    });
  }

  #renderPoint({point, types, destinations}) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onFavoritesChange: this.#handleDataChange, onModeChange: this.#handleModeChange
    });
    pointPresenter.init({
      point,
      types,
      destinations,
      destinationModel: this.#destinationModel,
      pointOptionsModel: this.#pointOptionsModel
    });
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPointList({filterType = FilterType.EVERYTHING, points, types, destinations, mainContainer}) {
    if (points.length > 0) {
      points.forEach((point) => this.#renderPoint({point, types, destinations}));
      render(this.#pointListComponent, mainContainer);
    } else {
      render(new EmptyListView(filterType), this.#container.querySelector('.trip-events'));
    }
  }

  #renderPointBoard({types, destinations, mainContainer, headerContainer}) {
    render(new TripInfoView(), headerContainer, RenderPosition.AFTERBEGIN);
    render(new FilterView(this.handleFilterChange), headerContainer.querySelector('.trip-controls__filters'));
    render(new SortView(SORT_TYPES, this.#handleSortTypeChange), mainContainer);
    this.#renderPointList({points: this.points, types, destinations, mainContainer});
  }

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


  handleFilterChange = (evt) => {
    if (evt.target.name === 'trip-filter') {

      this.#clearPointList();
      this.#clearFilterMessage();

      render(this.#pointListComponent, this.#container.querySelector('.trip-events'));

      const types = this.#pointOptionsModel.getAllTypes();
      const destinations = this.#destinationModel.getDestinations();
      const points = Object.entries(filter).filter(([filterType,]) =>
        filterType === evt.target.value).map(([, filterPoints]) => filterPoints(this.#pointModel.getPoints())).flat();

      this.#renderPointList({
        filterType: evt.target.value,
        points,
        types,
        destinations,
        mainContainer: this.#mainContainer
      });
    }
  };

  #handleDataChange = (updatePoint) => {
    const types = this.#pointOptionsModel.getAllTypes();
    const destinations = this.#destinationModel.getDestinations();
    this.points = updateItem(this.points, updatePoint);
    this.#pointPresenters.get(updatePoint.id).init({
      point: updatePoint, types, destinations, destinationModel: this.#destinationModel,
      pointOptionsModel: this.#pointOptionsModel
    });
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = () => {

  };
}


