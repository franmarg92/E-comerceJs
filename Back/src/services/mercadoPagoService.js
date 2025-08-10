const { mercadopago } = require('../helpers/mercadoPagoCliente');
const { Preference } = require('mercadopago');

const preferenceClient = new Preference(mercadopago);

const createPreference = async (cartItems, buyerEmail) => {
  const items = cartItems.map(item => ({
    title: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    currency_id: 'ARS',
  }));

  const preference = {
    items,
    payer: { email: buyerEmail },
    back_urls: {
      success: 'https://www.distinzionejoyas.com/pago-exitoso',
      failure: 'https://www.distinzionejoyas.com/pago-fallido',
      pending: '',
    },
    auto_return: 'approved',
  };

  const response = await preferenceClient.create({ body: preference });
  return response.init_point;
};

module.exports = { createPreference };