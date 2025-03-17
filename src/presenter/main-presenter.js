import PointPresenter from './point-presenter';
import PointListView from '../view/point-list-view';
import EmptyListView from '../view/empty-points-list-view';
import TripInfoView from '../view/trip-info-view';
import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import {updateItem} from '../utils/common';
import {remove, render, replace} from '../framework/render';
import {RenderPosition} from '../framework/render';
import {FilterType} from '../const';
import {filter} from '../utils/filter';
import {SORT_TYPES} from '../const';
import {SortType} from '../const';
import {sortByDay, sortByPrice, sortByTime} from '../utils/point';
import {UserAction} from '../const';
import {UpdateType} from '../const';
import PointFormAdd from '../view/point-form-add';
import {MODE_FORM_ADD} from '../const';

export default class MainPresenter {
  #pointListComponent = new PointListView();
  #pointPresenters = new Map();
  #emptyList = new EmptyListView();
  #formAddMode = MODE_FORM_ADD.DEFAULT;
  #filterView;
  #pointFormAdd;
  #container;
  #mainContainer;
  #headerContainer;
  #pointModel;
  #pointOptionsModel;
  #destinationModel;
  #currentSortType = SortType.SORT_DAY;
  #currentFilterType = FilterType.EVERYTHING;
  #sortComponent;
  #currentBoardPoints = [];
  #editButton;
  #types;
  #destinations;

  constructor(container, pointModel, pointOptionsModel, destinationModel) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#pointOptionsModel = pointOptionsModel;
    this.#destinationModel = destinationModel;
    this.#mainContainer = this.#container.querySelector('.trip-events');
    this.#headerContainer = this.#container.querySelector('.trip-main');
    this.#editButton = this.#headerContainer.querySelector('.trip-main__event-add-btn');
    this.#editButton.addEventListener('click', this.#pointAddClickHandler);
    this.#types = this.#pointOptionsModel.getAllTypes();
    this.#destinations = this.#destinationModel.getDestinations();

    pointModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#currentBoardPoints = [...this.#pointModel.getPoints()];
    this.#pointFormAdd = new PointFormAdd({
      offers: this.#pointOptionsModel.getOptions(),
      types: this.#types,
      destinations: this.#destinations,
      onCloseClick: this.#pointFormAddCloseHandler,
    });

    this.#renderPointBoard({
      types: this.#types,
      destinations: this.#destinations,
      mainContainer: this.#mainContainer,
      headerContainer: this.#headerContainer
    });
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.SORT_DAY:
        this.#currentBoardPoints.sort(sortByDay);
        break;
      case SortType.SORT_TIME:
        this.#currentBoardPoints.sort(sortByTime);
        break;
      case SortType.SORT_PRICE:
        this.#currentBoardPoints.sort(sortByPrice);
        break;
    }
    return this.#currentBoardPoints;
  }

  #renderPoint({point, types, destinations}) {
    const pointPresenter = new PointPresenter({
      resetFormAddPoint: this.#resetFormAddPoint,
      pointListContainer: this.#pointListComponent.element,
      onFavoritesChange: this.#handleViewAction, onModeChange: this.#handleModeChange
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

  #renderPoints({filterType = FilterType.EVERYTHING, points, types, destinations, mainContainer}) {
    if (points.length > 0) {
      points.forEach((point) => this.#renderPoint({point, types, destinations}));
      render(this.#pointListComponent, mainContainer);
    } else {
      render(new EmptyListView(filterType), this.#container.querySelector('.trip-events'));
    }
  }

  #renderPointBoard({types, destinations, mainContainer, headerContainer}) {
    render(new TripInfoView(), headerContainer, RenderPosition.AFTERBEGIN);
    this.#filterView = new FilterView(this.#handleFilterChange);
    render(this.#filterView, headerContainer.querySelector('.trip-controls__filters'));
    this.#renderSort();
    this.#renderPoints({points: this.points, types, destinations, mainContainer});
  }

  #clearBoard() {
    if (document.querySelector('.trip-events__list')) {
      this.#pointPresenters.forEach((presenter) => presenter.destroy());
      this.#pointPresenters.clear();
    }
  }

  #clearFilterMessage() {
    if (document.querySelector('.trip-events__msg')) {
      document.querySelector('.trip-events__msg').remove();
      this.#emptyList.removeElement();
    }
  }

  #handleFilterChange = (evt) => {
    if (evt.target.name === 'trip-filter') {
      this.#changeFilterType(evt.target.value);
    }
  };

  #changeFilterType(type) {
    this.#currentFilterType = type;
    this.#currentSortType = SortType.SORT_DAY;
    this.#clearBoard();
    this.#clearFilterMessage();

    render(this.#pointListComponent, this.#container.querySelector('.trip-events'));

    const points = Object.entries(filter).filter(([filterType,]) =>
      filterType === this.#currentFilterType).map(([, filterPoints]) => filterPoints(this.#pointModel.getPoints())).flat();
    this.#currentBoardPoints = points;
    this.#replaceSortComponent();
    this.#renderPoints({
      filterType: this.#currentFilterType,
      points: this.points,
      types: this.#types,
      destinations: this.#destinations,
      mainContainer: this.#mainContainer
    });
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      sortTypes: SORT_TYPES,
      onSortTypeChange: this.#handleSortTypeChange,
      pointListLength: this.#currentBoardPoints.length
    });
    render(this.#sortComponent, this.#mainContainer);
  }

  #replaceSortComponent() {
    const newSortComponent = new SortView({
      sortTypes: SORT_TYPES,
      onSortTypeChange: this.#handleSortTypeChange,
      pointListLength: this.#currentBoardPoints.length
    });
    replace(newSortComponent, this.#sortComponent);
    this.#sortComponent = newSortComponent;
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#currentBoardPoints = updateItem(this.#currentBoardPoints, data);
        this.#pointPresenters.get(data.id).init({
          point: data,
          types: this.#types,
          destinations: this.#destinations,
          destinationModel: this.#destinationModel,
          pointOptionsModel: this.#pointOptionsModel
        });
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#replaceSortComponent();
        this.#currentBoardPoints = this.#pointModel.getPoints();
        this.#currentSortType = SortType.SORT_DAY;
        this.#renderPoints({
          points: this.points,
          types: this.#types,
          destinations: this.#destinations,
          mainContainer: this.#mainContainer
        });
        break;
      case UpdateType.MAJOR:
        this.#clearBoard();
        this.#renderPointBoard({
          types: this.#types,
          destinations: this.#destinations,
          mainContainer: this.#mainContainer,
          headerContainer: this.#headerContainer
        });
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderPoints({
      points: this.points,
      types: this.#types,
      destinations: this.#destinations,
      mainContainer: this.#mainContainer
    });
  };

  resetView() {
    if (this.#formAddMode === MODE_FORM_ADD.OPEN) {
      this.#formAddMode = MODE_FORM_ADD.DEFAULT;
      this.#formAddMode = MODE_FORM_ADD.DEFAULT;
    }
  }

  #pointAddClickHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#formAddMode = MODE_FORM_ADD.OPEN;
    if (this.#currentFilterType !== FilterType.EVERYTHING) {
      this.#filterView.element.reset();
      this.#changeFilterType(FilterType.EVERYTHING);
    }

    if (this.#currentSortType !== SortType.SORT_DAY) {
      this.#replaceSortComponent();
      this.#handleSortTypeChange(SortType.SORT_DAY);
    }
    render(this.#pointFormAdd, this.#pointListComponent.element, 'afterbegin');
    document.addEventListener('keydown', this.#escKeyDownFormAddHandler);
    this.#editButton.disabled = true;
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
    this.#pointListComponent.element.firstChild.remove();
    document.removeEventListener('keydown', this.#escKeyDownFormAddHandler);
    this.#editButton.disabled = false;
    this.#formAddMode = MODE_FORM_ADD.DEFAULT;
  };

  #resetFormAddPoint = () => {
    if (this.#formAddMode !== MODE_FORM_ADD.DEFAULT) {
      this.#closeFormAddPoint();
    }
  };
}


