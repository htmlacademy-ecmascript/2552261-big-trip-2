import FilterView from '../view/filter-view';
import SortView from '../view/sort-view';
import EventEditView from '../view/event-edit/event-edit-view';
import EventListView from '../view/event-list-view';
import TripInfoView from '../view/./trip-info-view';
import {render} from '../render';


const tripControlsFilters = document.querySelector('.trip-controls__filters');
const tripEvents = document.querySelector('.trip-events');
const tripMain = document.querySelector('.trip-main');

export default class MainPresenter {
  init() {
    render(new TripInfoView(), tripMain, 'afterbegin');
    render(new FilterView(), tripControlsFilters);
    render(new SortView(), tripEvents);
    render(new EventEditView(), tripEvents);
    render(new EventListView(), tripEvents); // TODO отрисовка первых 3-х элементов.
  }
}


