const { MercadoPagoConfig } = require('mercadopago');

const mercadopago = new MercadoPagoConfig({
    
  accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  
});

module.exports = { mercadopago };
