const axios = require('axios');

const sanitizeEmail = (email) =>
  email
    .trim()
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // caracteres invisibles
    .replace(/["'<>()[\]{}|\\^`~;:,]/g, '') // símbolos conflictivos
    .replace(/\s+/g, '') // espacios
    .toLowerCase();




const enviarCorreoZoho = async ({ accessToken, accountId, to, subject, content }) => {
  try {
    const sanitizedTo = sanitizeEmail(to);

    const response = await axios.post(
      `https://mail.zoho.com/api/accounts/${accountId}/messages`,
      {
        fromAddress: "info@distinzionejoyas.com", 
        toAddress: sanitizedTo, 
        subject,
        content,
        mailFormat: "html" 
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
