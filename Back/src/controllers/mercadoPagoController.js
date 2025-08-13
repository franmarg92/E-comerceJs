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
    const { type, data, action } = req.body;

    if (type !== "payment" || !data?.id || action !== "payment.updated") {
      console.warn("Webhook ignorado por formato inválido");
      return res.status(400).send("Payload inválido");
    }

    await mercadoPagoService.processWebhook(req.body);
    return res.status(200).send("Webhook procesado");
  } catch (error) {
    console.error("Error procesando webhook:", error);
    return res.status(500).send("Error interno");
  }
};



module.exports = { createPreferenceController, handleWebhook };
