import MainPresenter from './presenter/main-presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import PointOptionsModel from './model/point-options-model';
import DestinationsModel from './model/destinations-model';

const pointsModel = new PointsModel();
const offersModel = new PointOptionsModel();
const filterModel = new FilterModel();
const destinationsModel = new DestinationsModel();

const mainContainer = document.querySelector('.page-body');
const mainPresenter = new MainPresenter({
  container: mainContainer,
  filterModel,
  pointModel: pointsModel,
  pointOptionsModel: offersModel,
  destinationModel: destinationsModel
});
mainPresenter.init();

