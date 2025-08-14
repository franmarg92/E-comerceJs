const { mercadoPagoService } = require("../services");
const { mercadoPagoMaperHelper } = require("../helpers/mercadoPagoMaperHelper");

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

/*const handleWebhook = async (req, res) => {
  try {
    const result = await mercadoPagoService.processWebhook(req.body);
    console.log("✅ Webhook procesado:", result);
    res.status(200).send("Webhook recibido");
  } catch (err) {
    console.error("❌ Error en webhook:", err);
    res.status(500).send("Error interno");
  }
};*/

module.exports = { createPreferenceController, /*handleWebhook*/ };
