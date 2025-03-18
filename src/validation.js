import Pristine from './vendor/pristine';

const setupUploadFormValidation = (form, price, destination) => {
  const pristine = new Pristine(form, {
    classTo: 'event__header',
    errorTextParent: 'event__header',
    errorClass: '--error',
    errorTextClass: 'event__header'
  });

  pristine.addValidator(price, (value) => {
    const pattern = /\d+/;
    return pattern.test(value);
  });

  pristine.addValidator(destination, (value) => {
      console.log(destination.value);
    const pattern = /^(Paris|Chamonix|Venice|Nagasaki|Saint Petersburg|Rotterdam|Hiroshima|Madrid|Vien|Barcelona)$/;
    return pattern.test(value);
  });

  return pristine;
};


export {setupUploadFormValidation};
