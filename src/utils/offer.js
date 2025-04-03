function getOfferById({id, offers}) {
  return offers.find((offer) => offer.id.localeCompare(id) === 0);
}

function getOffersByType({type, offers}) {
  return offers.find((obj) => obj.type.localeCompare(type) === 0)?.offers;
}

export {getOffersByType, getOfferById};
