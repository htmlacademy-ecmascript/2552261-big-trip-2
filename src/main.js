import MainPresenter from './presenter/main-presenter';
import HeaderPresenter from './presenter/header-presenter';
import PointsModel from './model/points-model';
import OffersModel from './model/offers-model';
import DestinationsModel from './model/destinations-model';

const mainContainer = document.querySelector('.trip-events');
const headerContainer = document.querySelector('.trip-main');

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

console.log(pointsModel.getPoints());
console.log(offersModel.getOffers());
console.log(destinationsModel.getDestinations());


const mainPresenter = new MainPresenter(mainContainer);
const headerPresenter = new HeaderPresenter(headerContainer);
mainPresenter.init();
headerPresenter.init();
