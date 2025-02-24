import {mockDestinations} from '../mock/destination';

export default class DestinationsModel {
  destinations = mockDestinations;

  getDestinations() {
    return this.destinations;
  }

  getDestinationById(id) {
    return this.destinations.find((obj) => obj.id.localeCompare(id) === 0);
  }
}
