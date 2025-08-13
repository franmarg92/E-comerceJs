const express = require("express");
const router = express.Router();
const { mercadoPagoController } = require("../controllers");

router.post("/create-preference", mercadoPagoController.createPreferenceController);
router.post("/webhook", mercadoPagoController.handleWebhook);
router.post("/hook", (req, res) => {
  console.log("Webhook recibido:", req.body);
  res.status(200).send("Webhook recibido");});
module.exports = router;