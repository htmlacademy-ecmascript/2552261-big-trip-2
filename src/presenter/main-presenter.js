import PointPresenter from './point-presenter';
import PointListView from '../view/point-list-view';
import EmptyListView from '../view/empty-points-list-view';
import TripInfoView from '../view/trip-info-view';
import SortView from '../view/sort-view';
import {updateItem} from '../utils/common';
import {render, RenderPosition, replace, remove} from '../framework/render';
import {FilterType, MODE_FORM_ADD, SORT_TYPES, SortType, UpdateType, UserAction} from '../const';
import {filter} from '../utils/filter';
import {sortByDay, sortByPrice, sortByTime} from '../utils/point';
import LoadingView from '../view/loading-view';

export default class MainPresenter {
  #pointListComponent = new PointListView();
  #loadingComponent = new LoadingView();
  #pointPresenters = new Map();
  #emptyList = new EmptyListView();
  #formAddMode = MODE_FORM_ADD.DEFAULT;
  #container;
  #mainContainer;
  #headerContainer;
  #pointModel;
  #pointOptionsModel;
  #destinationModel;
  #currentSortType = SortType.SORT_DAY;
  #currentFilterType;
  #sortComponent;
  #currentBoardPoints = [];
  #types;
  #destinations;
  #filterModel;
  #isLoading = true;

  constructor({container, pointModel, filterModel, pointOptionsModel, destinationModel}) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#pointOptionsModel = pointOptionsModel;
    this.#destinationModel = destinationModel;
    this.#mainContainer = this.#container.querySelector('.trip-events');
    this.#headerContainer = this.#container.querySelector('.trip-main');
    this.#types = this.#pointOptionsModel.getAllTypes();
    this.#destinations = this.#destinationModel.getDestinations();
    this.#filterModel = filterModel;
    pointModel.addObserver(this.#handleModelEvent);
    filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#currentBoardPoints = this.#pointModel.getPoints();
    this.#renderPointBoard({
      types: this.#types,
      destinations: this.#destinations,
      mainContainer: this.#mainContainer,
      headerContainer: this.#headerContainer
    });
  }

  get points() {
    this.#currentFilterType = this.#filterModel.filter;
    this.#currentBoardPoints = Object.entries(filter).filter(([filterType,]) =>
      filterType === this.#currentFilterType).map(([, filterPoints]) => filterPoints(this.#pointModel.getPoints())).flat();
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

  #renderPoint({point}) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onFavoritesChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      onAddClick: this.#HandlePointAddClick,
      pointOptionsModel: this.#pointOptionsModel,
      destinationModel: this.#destinationModel,
      types: this.#types,
      destinations: this.#destinations
    });
    pointPresenter.init({point});
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints({filterType = FilterType.EVERYTHING, points, mainContainer}) {
    if (points.length > 0) {
      points.forEach((point) => this.#renderPoint({point}));
      render(this.#pointListComponent, mainContainer);
    } else {
      render(new EmptyListView(filterType), this.#container.querySelector('.trip-events'));
    }
  }

  #renderPointBoard({mainContainer, headerContainer}) {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    render(new TripInfoView(), headerContainer, RenderPosition.AFTERBEGIN);
    this.#renderSort();
    this.#renderPoints({points: this.points, mainContainer});
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#mainContainer);
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

  #renderSort() {
    this.#sortComponent = new SortView({
      sortTypes: SORT_TYPES,
      onSortTypeChange: this.#handleSortTypeChange,
      pointListLength: this.points.length
    });
    render(this.#sortComponent, this.#mainContainer);
  }

  #replaceSortComponent() {
    this.#currentBoardPoints = this.points;
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
        this.#currentBoardPoints = this.#pointModel.getPoints();
        this.#clearFilterMessage();
        this.#replaceSortComponent();
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
        this.#clearFilterMessage();
        this.#currentFilterType = this.#filterModel.filter;
        this.#replaceSortComponent();
        this.#renderPoints({
          filterType: this.#currentFilterType,
          points: this.points,
          types: this.#types,
          destinations: this.#destinations,
          mainContainer: this.#mainContainer
        });
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderPointBoard({mainContainer: this.#mainContainer, headerContainer: this.#headerContainer});
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

  #HandlePointAddClick = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    if (this.#currentFilterType !== FilterType.EVERYTHING) {
      this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    }

    if (this.#currentSortType !== SortType.SORT_DAY) {
      this.#replaceSortComponent();
      this.#handleSortTypeChange(SortType.SORT_DAY);
    }
  };
}


