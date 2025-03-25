import ApiService from './framework/api-service';

export default class DestinationApiService extends ApiService {

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }
}
