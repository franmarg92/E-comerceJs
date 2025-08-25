const { codePorTokensZoho, getAccountId, getAccessToken } = require('../helpers/callBackZoho');
const { enviarCorreoZoho } = require('../helpers/zohoMailer');

const initZohoIntegration = async (code) => {
  try {
    const { access_token, refresh_token, expires_in } = await codePorTokensZoho(code);
    const accountId = await obtenerAccountId(access_token);

    

    return {
      access_token,
      refresh_token,
      accountId,
      expires_in,
      message: 'Integración Zoho lista para enviar mensajes boutique 💌',
    };
  } catch (error) {
    console.error('Error en zohoService:', error.message);
    throw new Error('Falló la integración con Zoho Mail 💥');
  }
};
const enviarCorreoService = async ({ to, subject, content }) => {
  try {
    const accessToken = await getAccessToken();
    const accountId = await getAccountId(accessToken); // ahora cacheado

    const resultado = await enviarCorreoZoho({
      accessToken,
      accountId,
      to,
      subject,
      content,
    });

    return {
      status: "success",
      message: "Mensaje boutique entregado con elegancia 💎",
      data: resultado,
    };
  } catch (error) {
  console.error("Error en enviarCorreoService:", error.response?.data || error.message);
  throw new Error("Zoho respondió: " + JSON.stringify(error.response?.data || error.message));
}
}

module.exports = { initZohoIntegration, enviarCorreoService };