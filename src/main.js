import MainPresenter from './presenter/main-presenter';
import PointsModel from './model/points-model';
import PointOptionsModel from './model/point-options-model';
import DestinationsModel from './model/destinations-model';

const pointsModel = new PointsModel();
const offersModel = new PointOptionsModel();
const destinationsModel = new DestinationsModel();

const mainContainer = document.querySelector('.page-body');
const mainPresenter = new MainPresenter(mainContainer, pointsModel, offersModel, destinationsModel);
mainPresenter.init();

