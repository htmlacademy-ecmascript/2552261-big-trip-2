import MainPresenter from './presenter/main-presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import PointOptionsModel from './model/point-options-model';
import DestinationsModel from './model/destinations-model';
import FilterPresenter from './presenter/filter-presenter';

const pointsModel = new PointsModel();
const offersModel = new PointOptionsModel();
const filterModel = new FilterModel();
const destinationsModel = new DestinationsModel();

const mainContainer = document.querySelector('.page-body');
const filterContainer = document.querySelector('.trip-controls__filters');

const filterPresenter = new FilterPresenter({filterContainer, filterModel, pointsModel});
const mainPresenter = new MainPresenter({
  container: mainContainer,
  filterModel,
  pointModel: pointsModel,
  pointOptionsModel: offersModel,
  destinationModel: destinationsModel
});

filterPresenter.init();
mainPresenter.init();

