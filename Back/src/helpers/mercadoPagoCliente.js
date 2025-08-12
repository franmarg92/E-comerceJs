const { MercadoPagoConfig, Payment, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

const preference = new Preference(client);
const payment = new Payment(client);

module.exports = { client, payment, preference };

