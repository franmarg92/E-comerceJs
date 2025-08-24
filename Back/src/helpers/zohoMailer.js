const axios = require('axios');

const sanitizeEmail = (email) =>
  email.trim().replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/["']/g, '');




const enviarCorreoZoho = async ({ accessToken, accountId, to, subject, content }) => {
  try {
    const sanitizedTo = sanitizeEmail(to);

    const response = await axios.post(
      `https://mail.zoho.com/api/accounts/${accountId}/messages`,
      {
        fromAddress: 'info@distinzionejoyas.com', // asegurate que esté autorizada
        toAddress: sanitizedTo, // ✅ string plano, limpio
        subject,
        content,
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error al enviar correo:', error.response?.data || error.message);
    throw new Error('Falló el envío del correo 💥');
  }
};

module.exports = { enviarCorreoZoho };
