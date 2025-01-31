import {mockOffers} from '../mock/offer';

export default class OffersModel {
  offers = mockOffers;

  getOffers() {
    return this.offers;
  }

  getTypeById(id) {
    return this.offers.find((obj) => obj.type.id.localeCompare(id)).type.image;
  }

  getOffersByType(type) {
    return this.offers.find((obj) => obj.type.id.localeCompare(type)).offers;
  }
}
