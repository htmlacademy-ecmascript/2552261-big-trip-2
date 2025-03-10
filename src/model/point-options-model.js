import {mockPointOptions} from '../mock/pointOption';

export default class PointOptionsModel {
  options = mockPointOptions;

  getOptions() {
    return this.options;
  }

  getAllTypes() {
    return this.options.map((option) => option.type);
  }

  getOffersByType(type) {
    return this.options.find((obj) => obj.type.localeCompare(type) === 0)?.offers;
  }

  getOffersById(id) {
    return this.options.find((obj) => obj.id.localeCompare(id) === 0);
  }
}
