const express = require("express");
const router = express.Router();
const { loginController } = require("../controllers");
const { registerController } = require("../controllers");


router.post("/login", loginController.loginUserController);
router.post("/register", registerController.registerUser);

module.exports = router;
