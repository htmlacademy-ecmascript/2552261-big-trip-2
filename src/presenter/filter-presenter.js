import {FilterType} from '../const';
import {render, replace, remove} from '../framework/render';
import {UpdateType} from '../const';
import FilterView from '../view/filter-view';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #filterComponent = null;

  constructor({filterContainer, filterModel, pointsModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    return FilterType;
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange,
      points: this.#pointsModel.getPoints()
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleFilterTypeChange = (evt) => {
    if (this.#filterModel.filter === evt.target.value) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, evt.target.value);
  };

  #handleModelEvent = () => {
    this.init();
  };
}
