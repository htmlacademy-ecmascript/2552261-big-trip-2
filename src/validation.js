import Pristine from './vendor/pristine';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const setupUploadFormValidation = (form, price, destination, endDateInput, startDateInput) => {
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
  }, 'Число должно быть положительным', false);

  pristine.addValidator(destination, (value) => {
    const pattern = /^(Paris|Chamonix|Venice|Nagasaki|Saint Petersburg|Rotterdam|Hiroshima|Madrid|Vien|Barcelona)$/;
    return pattern.test(value);
  }, 'Не выбрана точка маршрута', 1, false);


  pristine.addValidator(endDateInput, (value) => {
    const startDate = dayjs(startDateInput.value, 'DD/MM/YY HH:mm');
    const endDate = dayjs(value, 'DD/MM/YY HH:mm');
    return startDate.isBefore(endDate);
  }, 'Дата завершения раньше начала или пустая', 0,false);

  pristine.addValidator(startDateInput, (value) => {
    const startDate = dayjs(value, 'DD/MM/YY HH:mm');
    if (startDate.isValid()) {
      return true;
    }
    return false;
  }, 'Дата начала события позже завершения или пустая', 0,false);

  return pristine;
};


export {setupUploadFormValidation};
