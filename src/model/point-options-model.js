import Observable from '../framework/observable';

export default class PointOptionsModel extends Observable {
  #offers = [];
  #offersApiService;

  constructor({offerApiService}) {
    super();
    this.#offersApiService = offerApiService;
  }

  async init() {
    try {
      const offers = await this.#offersApiService.offers;
      this.#offers = offers.map((offer) => this.#adaptToClient(offer));
    } catch (err) {
      this.#offers = [];
    }
  }

  getOptions() {
    return this.#offers;
  }

  getAllTypes() {
    return this.#offers.map((option) => option.type);
  }

  getOffersByType(type) {
    return this.#offers.find((obj) => obj.type.localeCompare(type) === 0)?.offers;
  }

  #adaptToClient(offer) {
    const adaptOffer = {
      ...offer,
      type: offer['type'],
      offers: offer['offers']
    };
    return adaptOffer;
  }
}
