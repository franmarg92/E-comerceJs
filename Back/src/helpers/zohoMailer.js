const axios = require('axios');

const sanitizeEmail = (email) =>
  email.trim().replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/["']/g, '');




const enviarCorreoZoho = async ({ accessToken, accountId, to, subject, content }) => {
  try {
    const sanitizedTo = sanitizeEmail(to);

    const response = await axios.post(
      `https://mail.zoho.com/api/accounts/${accountId}/messages`,
      {
        fromAddress: "info@distinzionejoyas.com", // ⚠️ debe existir en Zoho Mail
        toAddress: [sanitizedTo], // ✅ Zoho espera array
        subject,
        content,
        mailFormat: "html" // opcional, si querés enviar HTML
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al enviar correo:", error.response?.data || error.message);
    throw new Error("Falló el envío del correo 💥 - " + JSON.stringify(error.response?.data || error.message));
  }
};


module.exports = { enviarCorreoZoho };
