const axios = require('axios');

 const recibirCallbackZoho = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Falta el código OAuth' });
  }

  try {
    const response = await axios.post('https://accounts.zoho.com/oauth/v2/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3000/api/oauth/callback',
        code,
      },
    });

    const { access_token, refresh_token, expires_in } = response.data;

    

    res.json({
      mensaje: 'Token recibido con éxito ✨',
      access_token,
      refresh_token,
      expires_in,
    });
  } catch (error) {
    console.error('Error en intercambio OAuth:', error.response?.data || error.message);
    res.status(500).json({ error: 'Falló el intercambio OAuth 😔' });
  }
};

module.exports = { recibirCallbackZoho };