import {mockDestinations} from '../mock/destination';

export default class DestinationsModel {
  destinations = mockDestinations;

  getDestinations() {
    return this.destinations;
  }
}
