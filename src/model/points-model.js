import {mockPoints} from '../mock/point';

export default class PointsModel {
  points = mockPoints;

  getPoints() {
    return this.points;
  }
}
