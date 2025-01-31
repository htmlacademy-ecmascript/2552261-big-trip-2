const mockOffers = [
  {
    type: {
      id: 'taxi',
      image: 'img/icons/taxi.png',
    },
    offers: [
      {
        id: '9053-42ce-b747-e281314baa31-b4c3e4e6',
        title: 'Order Uber',
        price: 20
      },
      {
        id: 'b4c3e4e6-9053-42ce-b747-e281314baa31',
        title: 'Order Yandex',
        price: 25
      },
      {
        id: '42ce-b747-e281314baa31-b4c3e4e6-9053',
        title: 'business class',
        price: 43
      }
    ]
  },
  {
    type: {
      id: 'bus',
      image: 'img/icons/bus.png',
    },
    offers: [
      {
        id: 'b4c3e4e6-9053-42',
        title: 'Drive to Tambov',
        price: 21
      },
    ]
  }
];

export {mockOffers};
