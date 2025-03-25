import Observable from '../framework/observable';
import {UpdateType} from '../const';

export default class PointsModel extends Observable {
  #points = [];
  #pointApiService;

  constructor({pointApiService}) {
    super();
    this.#pointApiService = pointApiService;
  }


  getPoints() {
    return this.#points;
  }

  async init() {
    try {
      const points = await this.#pointApiService.points;
      this.#points = points.map((point) => this.#adaptToClient(point));
    } catch (err) {
      this.#points = [];
    }
    this._notify(UpdateType.INIT);
  }

  addPoint(updateType, point) {
    this.#points.push(point);
    this._notify(updateType, point);
  }

  deletePoint(updateType, deletePoint) {
    const index = this.#points.findIndex((point) => point.id === deletePoint.id);
    if (index === -1) {
      throw new Error('Point not found');
    }
    this.#points = this.#points.filter((point) => point.id !== deletePoint.id);
    this._notify(updateType);
  }

  updatePoint(updateType, newPoint) {
    const index = this.#points.findIndex((point) => point.id === newPoint.id);
    if (index === -1) {
      throw new Error('Point not found');
    }
    this.#points.splice(index, 1, newPoint);
    this._notify(updateType, newPoint);
  }

  #adaptToClient(point) {
    const adaptPoint = {
      ...point,
      id: point['id'],
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      destination: point['destination'],
      isFavorite: point['is_favorite'],
      offers: point['offers'],
      type: point['type']
    };

    delete adaptPoint['base_price'];
    delete adaptPoint['date_from'];
    delete adaptPoint['date_to'];
    delete adaptPoint['is_favorite'];

    return adaptPoint;
  }
}
