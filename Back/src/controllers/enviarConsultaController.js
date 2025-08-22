const axios = require('axios');
const callbackZoho = require('../helpers/callBackZoho');

export const enviarConsultaCliente = async (req, res) => {
  const { nombre, correo, mensaje } = req.body;

  const accessToken = await callbackZoho.recibirCallbackZoho(); 

 const payload = {
  fromAddress: 'info@distinzionejoyas.com', 
  toAddress: ['info@distinzionejoyas.com'], 
  subject: `Consulta desde Distinzione – ${nombre}`,
  content: `
    ✨ Nueva consulta boutique recibida:
    ────────────────────────────────
    👤 Nombre: ${nombre}
    📧 Correo: ${correo}
    💬 Mensaje: ${mensaje}
    ────────────────────────────────
  `,
};

  try {
    await axios.post(
      'https://mail.zoho.com/api/accounts/{account_id}/messages',
      payload,
      { headers: { Authorization: `Zoho-oauthtoken ${accessToken}` } }
    );
    res.json({ ok: true });
  } catch (error) {
    console.error('Error al enviar correo:', error.response?.data || error.message);
    res.status(500).json({ ok: false, error: 'Falló el envío boutique 😔' });
  }
};
