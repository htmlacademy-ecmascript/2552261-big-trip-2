import {mockOffers} from '../mock/offer';

export default class OffersModel {
  offers = mockOffers;

  getOffers() {
    return this.offers;
  }
}
