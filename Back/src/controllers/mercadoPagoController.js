const {mercadoPagoService} = require('../services');

const createPreferenceController = async (req, res) => {
  try {
    const { cart, email } = req.body;
    if (!cart || !email) return res.status(400).json({ error: 'Datos incompletos' });

    const url = await mercadoPagoService.createPreference(cart, email);
    res.json({ url });
  } catch (err) {
    console.error('❌ Error al generar preferencia:', err);
    res.status(500).json({ error: 'Error interno' });
  }
}

module.exports = { createPreferenceController}