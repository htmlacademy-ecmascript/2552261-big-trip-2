import SortView from '../view/sort-view';
import PointFormView from '../view/point-form/point-form-view';
import PointListView from '../view/point-list-view';
import PointView from '../view/point-view';
import {render} from '../render';

const POINT_AMOUNT = 3;

export default class MainPresenter {
  pointListComponent = new PointListView();

  constructor(container) {
    this.container = container;
  }

  init() {
    render(new SortView(), this.container);
    render(this.pointListComponent, this.container);
    render(new PointFormView(), this.pointListComponent.getElement());

    for (let i = 0; i < POINT_AMOUNT; i++) {
      render(new PointView(), this.pointListComponent.getElement());
    }
  }
}


