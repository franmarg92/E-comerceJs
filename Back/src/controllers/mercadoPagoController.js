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


const webhookClientController = async (req, res) => { 
    const body = req.body 
    const eventType = body.eventType || req.body.action;
   
    if (!body) {
      console.error("❌ No body found in webhook request");
      return res.status(400).json({ error: "Bad Request" });
    } 

    const paymentId = body.data.id;
    
    if(!eventType || !paymentId) {
      console.error("❌ Missing eventType or paymentId in webhook request");
      return res.status(400).json({ error: "Bad Request" });
    }

    try {
      if (eventType === "payment") {
        const payment = await mercadoPagoService.webhookClient(paymentId);
        console.log("✅ Payment processed:", payment);
        // Aquí puedes llamar a otra función para procesar el pago aprobado
        // await mercadoPagoService.processApprovedPayment(payment);
      } else {
        console.log("ℹ️ Unhandled event type:", eventType);
      }
      res.status(200).json({ message: "Webhook received" });
    } catch (err) {
      console.error("❌ Error processing webhook:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
}
module.exports = { createPreferenceController, webhookClientController };
