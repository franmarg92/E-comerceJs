const express = require("express");
const router = express.Router();
const { registerController } = require("../controllers");

router.post("/register", registerController.registerUser);

module.exports = router;
