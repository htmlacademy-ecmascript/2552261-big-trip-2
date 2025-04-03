function getDestinationById({id, destinations}) {
  return destinations.find((obj) => obj.id.localeCompare(id) === 0);
}

export {getDestinationById};
