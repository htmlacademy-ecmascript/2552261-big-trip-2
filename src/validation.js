import Pristine from './vendor/pristine';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const setupUploadFormValidation = (form, price, destination, startDateInput, endDateInput) => {
  const pristine = new Pristine(form, {
    classTo: 'event--edit',
    errorTextParent: 'event--edit',
    errorClass: '--error',
    errorTextClass: 'event--edit'
  });

  pristine.addValidator(price, (value) => {
    const pattern = /\d+/;
    return pattern.test(value);
  });

  pristine.addValidator(destination, (value) => {
    const pattern = /^(Paris|Chamonix|Venice|Nagasaki|Saint Petersburg|Rotterdam|Hiroshima|Madrid|Vien|Barcelona)$/;
    return pattern.test(value);
  });

  pristine.addValidator(startDateInput, (value) => {
    const startDate = dayjs(value, 'DD/MM/YY HH:mm');
    return startDate;
  });

  pristine.addValidator(endDateInput, (value) => {
    const startDate = dayjs(startDateInput.value, 'DD/MM/YY HH:mm');
    const endDate = dayjs(value, 'DD/MM/YY HH:mm');
    return startDate.isBefore(endDate);
  });

  return pristine;
};


export {setupUploadFormValidation};
