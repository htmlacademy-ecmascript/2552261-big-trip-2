import MainPresenter from './presenter/main-presenter';
import HeaderPresenter from './presenter/header-presenter';

const mainContainer = document.querySelector('.trip-events');
const headerContainer = document.querySelector('.trip-main');


const mainPresenter = new MainPresenter(mainContainer);
const headerPresenter = new HeaderPresenter(headerContainer);
mainPresenter.init();
headerPresenter.init();
