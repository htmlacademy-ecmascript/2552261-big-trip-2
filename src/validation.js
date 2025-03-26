import Pristine from 'pristinejs/dist/pristine.min';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const setupUploadFormValidation = (destinations, form, price, destination, endDateInput, startDateInput) => {
  const pristine = new Pristine(form, {
    classTo: 'event__field-group',
    errorTextParent: 'event__field-group',
    errorClass: 'has-danger',
    errorTextClass: 'event--edit-error',
    errorTextTag: 'div',
  });

  pristine.addValidator(price, (value) => {
    const pattern = /^\d+$/;
    return pattern.test(value);
  }, 'Стоимость. Целое положительное число', 0, false);

  pristine.addValidator(destination, (value) => {
    const isValid = destinations.some((dest) => dest.name.toLowerCase() === value.toLowerCase());
    return isValid;
  }, 'Не выбрана точка маршрута', 0, false);


  pristine.addValidator(endDateInput, (value) => {
    const endDate = dayjs(value, 'DD/MM/YY HH:mm');
    if (endDate.isValid()) {
      return true;
    }
    return false;
  }, 'Не выбрана дата маршрута', 0, false);

  pristine.addValidator(startDateInput, (value) => {
    const startDate = dayjs(value, 'DD/MM/YY HH:mm');
    if (startDate.isValid()) {
      return true;
    }
    return false;
  }, 'Не выбрана дата маршрута', 0, false);
  return pristine;
};

export {setupUploadFormValidation};
