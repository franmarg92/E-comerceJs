const express = require("express");
const router = express.Router();
const { mercadoPagoController } = require("../controllers");

router.post(
  "/create-preference",
  mercadoPagoController.createPreferenceController
);
router.post("/webhook", mercadoPagoController.handleWebhook);
router.post("/mP/webhook", (req, res) => {
    const body = req.body;
  console.log("Webhook recibido:", body);
  console.log("Webhook pa:", req.body);
  res.status(200).send("Webhook giil ");
});
module.exports = router;
