import SortView from '../view/sort-view';
import PointFormView from '../view/point-form-view';
import PointListView from '../view/point-list-view';
import PointView from '../view/point-view';
import {render} from '../render';

export default class MainPresenter {
  pointListComponent = new PointListView();

  constructor(container, pointModel, pointOptionsModel, destinationModel) {
    this.container = container;
    this.pointModel = pointModel;
    this.pointOptionsModel = pointOptionsModel;
    this.destinationModel = destinationModel;
  }

  init() {
    this.points = this.pointModel.getPoints();
    const types = this.pointOptionsModel.getAllTypes();

    render(new SortView(), this.container);
    render(this.pointListComponent, this.container);
    render(new PointFormView({types, destinations: this.destinationModel.getDestinations()}), this.pointListComponent.getElement());

    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      const type = this.getTypeImage(this.points, i);
      const destination = this.destinationModel.getDestinationById(this.points[i].destination);
      const offers = this.pointOptionsModel.getOffersByType(this.points[i].type);

      render(new PointView({point, type, destination, offers}), this.pointListComponent.getElement());
    }
  }

  getTypeImage(points, index) {
    return {
      type: this.points[index].type,
      image: `img/icons/${this.points[index].type}.png`
    };
  }

}


