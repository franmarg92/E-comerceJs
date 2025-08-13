const express = require("express");
const router = express.Router();
const { mercadoPagoController } = require("../controllers");

router.post("/create-preference", mercadoPagoController.createPreferenceController);
router.post("/webhook", mercadoPagoController.webhookClientController);
module.exports = router;