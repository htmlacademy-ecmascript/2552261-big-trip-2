import {createElement} from '../../render';

function createEventDestinationTemplate() {
  return '<section class="event__section  event__section--destination">\n' +
    '                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>\n' +
    '                    <p class="event__destination-description">Geneva is a city in Switzerland that lies at the southern tip of expansive Lac Léman (Lake Geneva). Surrounded by the Alps and Jura mountains, the city has views of dramatic Mont Blanc.</p>\n' +
    '\n' +
    '                    <div class="event__photos-container">\n' +
    '                      <div class="event__photos-tape">\n' +
    '                        <img class="event__photo" src="img/photos/1.jpg" alt="Event photo">\n' +
    '                        <img class="event__photo" src="img/photos/2.jpg" alt="Event photo">\n' +
    '                        <img class="event__photo" src="img/photos/3.jpg" alt="Event photo">\n' +
    '                        <img class="event__photo" src="img/photos/4.jpg" alt="Event photo">\n' +
    '                        <img class="event__photo" src="img/photos/5.jpg" alt="Event photo">\n' +
    '                      </div>\n' +
    '                    </div>\n' +
    '                  </section>';
}

export default class EventDestinationView {
  getTemplate() {
    return createEventDestinationTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
