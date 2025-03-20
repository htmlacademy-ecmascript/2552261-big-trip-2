function blockSubmitButton(button) {
  button.disabled = true;
}

function unblockSubmitButton(button) {
  button.disabled = false;
}

const change = (evt, pristine, destinations, setState, updateElement, submitButton) => {
  evt.preventDefault();
  const isValid = pristine.validate(evt.target);

  if (isValid || evt.target.value === '') {
    const newDestination = destinations.find((destination) => destination.name === evt.target.value);
    setState({ destination: newDestination });
    updateElement({ destination: newDestination?.id ? newDestination.id : '' });
    unblockSubmitButton(submitButton);
    // Инициализация pristine, если необходимо
  } else {
    setState({ destination: {} }); //TODO DRY (дублирующий код)
    updateElement({ destination: '' });
    // Инициализация pristine, если необходимо
  }
};


export {blockSubmitButton, unblockSubmitButton, change};
