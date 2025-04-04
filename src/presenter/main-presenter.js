import PointPresenter from './point-presenter';
import PointListView from '../view/point-list-view';
import EmptyListView from '../view/empty-points-list-view';
import SortView from '../view/sort-view';
import {updateItem} from '../utils/common';
import {remove, render, replace} from '../framework/render';
import {FilterType, SORT_TYPES, SortType, UpdateType, UserAction} from '../const';
import {filter} from '../utils/filter';
import {sortByDay, sortByPrice, sortByTime} from '../utils/point';
import LoadingView from '../view/loading-view';
import NewPointPresenter from './new-point-presenter';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class MainPresenter {
  #pointListComponent = new PointListView();
  #loadingComponent = new LoadingView();
  #pointPresenters = new Map();
  #newPointPresenter;
  #emptyList = new EmptyListView();
  #container;
  #mainContainer;
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
  #addButton;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({container,addButton, pointModel, filterModel, pointOptionsModel, destinationModel}) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#pointOptionsModel = pointOptionsModel;
    this.#destinationModel = destinationModel;
    this.#mainContainer = this.#container.querySelector('.trip-events');
    this.#types = this.#pointOptionsModel.getAllTypes();
    this.#destinations = this.#destinationModel.getDestinations();
    this.#filterModel = filterModel;
    this.#addButton = addButton;
    this.#addButton.addEventListener('click', this.#pointAddClickHandler);
    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointListComponent.element,
      pointOptionsModel: this.#pointOptionsModel,
      destinationModel: this.#destinationModel,
      renderEmptyList: this.#renderEmptyList,
      handleDataChange: this.#handleViewAction,
      addButton: this.#addButton,
      types: this.#types
    });
    pointModel.addObserver(this.#handleModelEvent);
    filterModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#currentBoardPoints = this.#pointModel.getPoints();
    this.#renderPointBoard({
      types: this.#types,
      destinations: this.#destinations,
      mainContainer: this.#mainContainer,
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
      pointOptionsModel: this.#pointOptionsModel,
      destinationModel: this.#destinationModel,
      types: this.#types,
      destinations: this.#destinations,
      newPointPresenter: this.#newPointPresenter
    });
    pointPresenter.init({point});
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints({filterType = this.#filterModel.filter, points, mainContainer}) {
    render(this.#pointListComponent, mainContainer);
    if (points.length > 0) {
      points.forEach((point) => this.#renderPoint({point}));
    } else {
      this.#renderEmptyList(filterType);
    }
  }

  #renderEmptyList = (filterType) => {
    this.#emptyList = new EmptyListView(filterType);
    render(this.#emptyList, this.#container.querySelector('.trip-events'));
  };

  #renderPointBoard({mainContainer}) {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
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
    this.#clearFilterMessage();
  }

  #clearFilterMessage() {
    if (document.querySelector('.trip-events__msg')) {
      remove(this.#emptyList);
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

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointModel.addPoint(updateType, update);
          this.#newPointPresenter.destroy();
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();
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
        this.#currentSortType = SortType.SORT_DAY;
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
        this.#renderPointBoard({mainContainer: this.#mainContainer});
        break;
    }
  };

  clearLoadingMessage() {
    this.#isLoading = false;
    remove(this.#loadingComponent);
    render(new EmptyListView(), this.#container.querySelector('.trip-events'));
  }

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

  #pointAddClickHandler = () => {
    this.#clearBoard();
    this.#renderPoints({
      points: this.points,
      types: this.#types,
      destinations: this.#destinations,
      mainContainer: this.#mainContainer
    });
    if (this.#currentFilterType !== FilterType.EVERYTHING) {
      this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    }
    if (this.#currentSortType !== SortType.SORT_DAY) {
      this.#replaceSortComponent();
      this.#handleSortTypeChange(SortType.SORT_DAY);
    }
    this.#clearFilterMessage();
    this.#newPointPresenter.init();
  };
}


