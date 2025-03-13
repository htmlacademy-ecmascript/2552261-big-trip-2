import {mockPoints} from '../mock/point';
import Observable from '../framework/observable';

export default class PointsModel extends Observable {
  #points = mockPoints;

  getPoints() {
    return this.#points;
  }

  addPoint(updateType, point) {
    this.#points.push(point);
    this._notify(updateType, point);
  }

  updatePoint(updateType, newPoint) {
    const index = this.#points.findIndex((point) => point.id === newPoint.id);
    if (index === -1) {
      throw new Error('Point not found');
    }
    this.#points = this.#points.splice(index, 1, newPoint);
    this._notify(updateType, newPoint);
  }
}
