
const {zohoService} = require('../services');


const initZohoController = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({
      error: 'Falta el código de autorización de Zoho 😢',
    });
  }

  try {
    const result = await zohoService.initZohoIntegration(code);

    res.status(200).json({
      message: result.message,
      accountId: result.accountId,
      expires_in: result.expires_in,
      
    });
  } catch (error) {
    console.error('Error en initZohoController:', error.message);
    res.status(500).json({
      error: 'No pudimos activar tu canal boutique con Zoho Mail 💥',
    });
  }
};

const enviarCorreoController = async (req, res) => {
  const { to, subject, content } = req.body;
;

  console.log(`[Contacto] Intento de envío a ${to} - ${new Date().toISOString()} - IP: ${req.ip}`);
  try {
    const resultado = await zohoService.enviarCorreoService({ to, subject, content });
    res.status(200).json(resultado);
  } catch (error) {
    console.error("Error en enviarCorreoController:", error);
    res.status(500).json({ error: error.message });
  }
};



module.exports = { initZohoController, enviarCorreoController };
