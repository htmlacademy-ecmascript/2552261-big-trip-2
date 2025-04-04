import AbstractView from '../framework/view/abstract-view';
import {getDestinationById} from '../utils/destination';
import {getOffersByType} from '../utils/offer';
import {sortByDay} from '../utils/point';
import dayjs from 'dayjs';

function getTravelRoute({points, destinations}) {
  if (points.length <= 3) {
    return points.map((point) => getDestinationById({id: point.destination, destinations}).name).join(' — ');
  } else {
    const firstTravelPoint = points[0].destination;
    const lastTravelPoint = points[points.length - 1].destination;
    return `${getDestinationById({
      id: firstTravelPoint,
      destinations
    }).name} —...— ${getDestinationById({id: lastTravelPoint, destinations}).name}`;
  }
}

function getTravelRouteDate(points) {
  if (points.length > 0) {
    const dateFrom = dayjs(points[0].dateFrom).format('DD MMM').toUpperCase();
    const dateTo = dayjs(points[points.length - 1].dateTo).format('DD MMM').toUpperCase();
    return `${dateFrom} — ${dateTo}`;
  }
}

function getTotalPrice({points, offers}) {
  return points.reduce((total, point) => {
    total += point.basePrice + getOffersPrice({point, offers});
    return total;
  }, 0);
}

function getOffersPrice({point, offers}) {
  if (offers.length > 0) {
    const offersByType = getOffersByType({type: point.type, offers});
    const pointOffers = offersByType.filter((offer) => point.offers.some((pointOffer) => offer.id.localeCompare(pointOffer) === 0));
    return pointOffers.reduce((total, offer) => {
      total += offer.price;
      return total;
    }, 0);
  }
}

function createTripMainInfoItem({points, destinations, offers}) {
  if (points.length > 0) {
    return `      <div class="trip-info__main">
              <h1 class="trip-info__title">${getTravelRoute({points, destinations})}</h1>

              <p class="trip-info__dates">${getTravelRouteDate(points)}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalPrice({points, offers})}</span>
            </p>`;
  }
  return '';
}

function createTripMainInfoTemplate({points, destinations, offers}) {
  getTotalPrice({points, destinations, offers});
  return `<section class="trip-main__trip-info  trip-info">
            ${createTripMainInfoItem({points, destinations, offers})}
          </section>`;
}

export default class TripInfoView extends AbstractView {
  #points = null;
  #offers = null;
  #destinations = null;

  constructor({points, offers, destinations}) {
    super();
    this.#points = points.getPoints();
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    this.#points.sort(sortByDay);
    return createTripMainInfoTemplate({points: this.#points, destinations: this.#destinations, offers: this.#offers});
  }
}
