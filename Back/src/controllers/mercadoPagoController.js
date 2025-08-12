const {mercadoPagoService} = require('../services');
const {mercadoPagoMaperHelper} = require('../helpers/mercadoPagoMaperHelper');


const createPreferenceController = async (req, res) => {
  try {
    const order = req.body;
    const payload = await mercadoPagoMaperHelper(order);

    const url = await mercadoPagoService.createPreference(
      payload.cart,
      payload.email,
      payload.userId,
      payload.shippingAddressId,
      payload.notes
    );

    res.json({ url });
  } catch (err) {
    console.error("❌ Error al generar preferencia desde orden:", err);
    res.status(500).json({ error: "Error interno" });
  }
};


const mercadoPagoWebhookController = async (req, res) => {
  try {
    const paymentId = req.body?.data?.id;
    if (!paymentId) return res.status(400).json({ error: "Falta payment_id" });

    await mercadoPagoService.processApprovedPayment(paymentId);
    res.status(200).send("Orden procesada");
  } catch (err) {
    console.error("❌ Error en webhook:", err);
    res.status(500).send("Error interno");
  }
};

module.exports = { createPreferenceController, mercadoPagoWebhookController}