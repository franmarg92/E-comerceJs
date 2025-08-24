const express = require('express');
const router = express.Router();
const {zohoController} = require('../controllers')

router.post('/init', zohoController.initZohoController )
router.post('/send', zohoController.enviarCorreoController )



module.exports = router;