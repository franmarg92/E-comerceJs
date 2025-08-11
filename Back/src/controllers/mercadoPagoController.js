const {mercadoPagoService} = require('../services');
const {mercadoPagoMaperHelper} = require('../helpers/mercadoPagoMaperHelper');

const createPreferenceController = async (req, res) => {
  try {
    const order = req.body;
    const payload = await mercadoPagoMaperHelper(order); 
    const url = await mercadoPagoService.createPreference(payload.cart, payload.email);
    res.json({ url });
  } catch (err) {
    console.error('❌ Error al generar preferencia desde orden:', err);
    res.status(500).json({ error: 'Error interno' });
  }
};

module.exports = { createPreferenceController}