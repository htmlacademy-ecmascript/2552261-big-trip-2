import TripInfoView from '../view/trip-info-view';
import FilterView from '../view/filter-view';
import {render} from '../framework/render';

export default class HeaderPresenter {
  #pointModel;

  constructor(container, pointModel) {
    this.container = container;
    this.#pointModel = pointModel;
  }

  init() {
    const controlsFiltersContainer = this.container.querySelector('.trip-controls__filters');
    render(new TripInfoView(), this.container, 'afterbegin');
    render(new FilterView(), controlsFiltersContainer);
  }

}
