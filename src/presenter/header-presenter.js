import TripInfoView from '../view/trip-info-view';
import FilterView from '../view/filter-view';
import {render} from '../render';

export default class HeaderPresenter {
  constructor(container) {
    this.container = container;
  }

  init() {
    const controlsFiltersContainer = this.container.querySelector('.trip-controls__filters');
    render(new TripInfoView(), this.container, 'afterbegin');
    render(new FilterView(), controlsFiltersContainer);
  }

}
