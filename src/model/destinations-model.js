import Observable from '../framework/observable';

export default class DestinationsModel extends Observable {
  #destinations = [];
  #destinationApiService;

  constructor({destinationApiService}) {
    super();
    this.#destinationApiService = destinationApiService;
  }

  async init() {
    try {
      const destinations = await this.#destinationApiService.destinations;
      this.#destinations = destinations.map((destination) => this.#adaptToClient(destination));
    } catch (err) {
      this.#destinations = [];
    }
  }

  getDestinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    return this.#destinations.find((obj) => obj.id.localeCompare(id) === 0);
  }

  #adaptToClient(destination) {
    const adaptDestination = {
      ...destination,
      id: destination['id'],
      description: destination['description'],
      name: destination['name'],
      pictures: destination['pictures']
    };
    return adaptDestination;
  }
}
