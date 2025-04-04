import {remove, render, replace} from '../framework/render';
import TripInfoView from '../view/trip-info-view';
import {RenderPosition} from '../render';

export default class TripInfoPresenter {

  #tripInfoContainer = null;
  #tripInfoComponent = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  constructor({tripInfoContainer, pointsModel, offersModel, destinationsModel}) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const prevTripInfoComponent = this.#tripInfoComponent;
    this.#tripInfoComponent = new TripInfoView({points: this.#pointsModel, offers: this.#offersModel.getOptions(), destinations: this.#destinationsModel.getDestinations()});

    if (prevTripInfoComponent === null) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };
}
