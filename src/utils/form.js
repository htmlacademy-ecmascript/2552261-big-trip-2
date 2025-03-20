function blockSubmitButton(button) {
  button.disabled = true;
}

function unblockSubmitButton(button) {
  button.disabled = false;
}

export {blockSubmitButton, unblockSubmitButton};
