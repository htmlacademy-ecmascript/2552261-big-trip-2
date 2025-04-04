import ApiService from '../framework/api-service';
import {URL} from '../const';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class PointApiService extends ApiService {

  get points() {
    return this._load({url: URL.POINTS})
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `${URL.POINTS}/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async addPoint(point) {
    const response = await this._load({
      url: URL.POINTS,
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deletePoint(point) {
    const response = this._load({url: `${URL.POINTS}/${point.id}`, method: Method.DELETE});
    return response;
  }

  #adaptToServer(point) {
    const adaptPoint = {
      ...point,
      'base_price': Number(point.basePrice),
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'is_favorite': Boolean(point.isFavorite),
    };

    delete adaptPoint.basePrice;
    delete adaptPoint.dateFrom;
    delete adaptPoint.dateTo;
    delete adaptPoint.isFavorite;
    delete adaptPoint.initialPrice;

    return adaptPoint;
  }
}
