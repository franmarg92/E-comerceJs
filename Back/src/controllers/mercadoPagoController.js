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


const mercadoPagoWebhookController = async (req, res) => {
  try {
    console.log("📩 Webhook recibido:", req.body);

    const eventType = req.body?.type || req.body?.action || "";
    const paymentId = req.body?.data?.id;

    if (!eventType) {
      console.error("❌ Falta type/action en webhook");
      return res.status(400).json({ error: "Falta type/action" });
    }

    if (!["payment", "payment.updated", "payment.created"].includes(eventType)) {
      console.warn("⚠️ Webhook ignorado:", eventType);
      return res.status(200).send("Ignorado");
    }

    if (!paymentId) {
      console.error("❌ Falta payment_id en webhook");
      return res.status(400).json({ error: "Falta payment_id" });
    }

    await mercadoPagoService.processApprovedPayment(paymentId);
    res.status(200).send("Orden procesada");
  } catch (err) {
    console.error("❌ Error en webhook:", err);
    res.status(500).send("Error interno");
  }
};

module.exports = { createPreferenceController, mercadoPagoWebhookController };
