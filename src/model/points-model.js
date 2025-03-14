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

  deletePoint(updateType, deletePoint) {
    const index = this.#points.findIndex((point) => point.id === deletePoint.id);
    if (index === -1) {
      throw new Error('Point not found');
    }
    this.#points.splice(0, 1);
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
}
