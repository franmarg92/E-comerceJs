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

const handleWebhook = async (req, res) => {
  try {
    const { query } = req;
    logger?.info("Webhook recibido", { query });

    await mercadoPagoService.processWebhook(query);
    return res.status(200).send("OK");
  } catch (error) {
    logger?.error("Error en webhook", { error });
    return res.status(500).send("Error procesando webhook");
  }
};



module.exports = { createPreferenceController, handleWebhook };
