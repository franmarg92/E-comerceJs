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
  
    const { body } = req;
    console.log("Webhook received:", body);   
    const eventType = body.type || body.action;
    const paymentId = body.data.id;
    
    if(!eventType || !paymentId) {
      console.error("❌ Missing event type or payment ID in webhook payload");
      return res.status(400).json({ error: "Bad Request" });
    }

    if (eventType === "payment.created" || eventType === "payment.updated") {
      try {
        const payment = await mercadoPagoService.processApprovedPayment(paymentId);
        if (!payment) {
          console.error(`❌ Payment with ID ${paymentId} not found`);
          return res.status(404).json({ error: "Payment not found" });
        }

        // Process the payment as needed
        console.log("Payment details:", payment);
        
        // Respond with success
        return res.status(200).json({ message: "Webhook processed successfully" });
      } catch (error) {
        console.error("❌ Error processing webhook:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }
}
module.exports = { createPreferenceController, mercadoPagoWebhookController };
