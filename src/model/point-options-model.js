import {mockPointOptions} from '../mock/pointOption';

export default class PointOptionsModel {
  options = mockPointOptions;

  getOptions() {
    return this.options;
  }

  getTypeById(id) {
    return this.options.find((obj) => obj.type.id.localeCompare(id) === 0)?.type;
  }

  getOffersByType(type) {
    return this.options.find((obj) => obj.type.id.localeCompare(type) === 0)?.offers;
  }

  getOffersById(id) {
    return this.options.find((obj) => obj.id.localeCompare(id) === 0);
  }
}
