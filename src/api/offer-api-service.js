import ApiService from '../framework/api-service';
import {URL} from '../const';

export default class OfferApiService extends ApiService {
  get offers() {
    return this._load({url: URL.OFFERS})
      .then(ApiService.parseResponse);
  }
}
