import SortView from '../view/sort-view';
import PointFormView from '../view/point-form/point-form-view';
import PointListView from '../view/point-list-view';
import PointView from '../view/point-view';
import {render} from '../render';

export default class MainPresenter {
  pointListComponent = new PointListView();

  constructor(container, pointModel, offersModel, destinationModel) {
    this.container = container;
    this.pointModel = pointModel;
    this.offersModel = offersModel;
    this.destinationModel = destinationModel;
  }

  init() {
    this.points = this.pointModel.getPoints();
    render(new SortView(), this.container);
    render(this.pointListComponent, this.container);
    render(new PointFormView(), this.pointListComponent.getElement());

    for (let i = 0; i < this.points.length; i++) {
      console.log(this.offersModel.getOffersByType(this.points[i].type)); // TODO delete
      render(new PointView({point: this.points[i]},
        this.offersModel.getTypeById(this.points[i].type),
        {destination: this.destinationModel.getDestinationById(this.points[i].destination)}),
      this.pointListComponent.getElement());
    }
  }
}


