const axios = require("axios");

const codePorTokensZoho = async (code) => {
  const response = await axios.post(
    "https://accounts.zoho.com/oauth/v2/token",
    null,
    {
      params: {
        grant_type: "authorization_code",
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        redirect_uri: process.env.ZOHO_REDIRECT_URI,
        code,
      },
    }
  );

  const { access_token, refresh_token, expires_in } = response.data;
  return { access_token, refresh_token, expires_in };
};

const accessTokenPorRefreshToken = async () => {
  try {
    const response = await axios.post("https://accounts.zoho.com/oauth/v2/token", null, {
      params: {
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: "refresh_token",
      },
    });

    return response.data.access_token;
  } catch (err) {
    console.error("Error renovando token Zoho:", err.response?.data || err.message);
    throw err;
  }
};


let cachedToken = null;
let lastRefresh = 0;
let cachedAccountId = null;

const getAccessToken = async () => {
  const ahora = Date.now();
  if (cachedToken && ahora - lastRefresh < 50 * 60 * 1000) return cachedToken;
  if (ahora - lastRefresh < 60 * 1000) throw new Error('Throttle: Esperá un momento');

  cachedToken = await accessTokenPorRefreshToken();
  lastRefresh = ahora;
  return cachedToken;
};

const getAccountId = async (accessToken) => {
  if (cachedAccountId) return cachedAccountId; // ✅ usar el cache

  const response = await axios.get("https://mail.zoho.com/api/accounts", {
    headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
  });

  const accountId = response.data?.data?.[0]?.accountId;
  if (!accountId) throw new Error("No se encontró accountId 😔");

  cachedAccountId = accountId; // ✅ guardarlo para futuros envíos
  return accountId;
};

const validarToken = async (accessToken) => {
  try {
    await axios.get("https://mail.zoho.com/api/accounts", {
      headers: { Authorization: `Zoho-oauthtoken ${accessToken}` },
    });
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  codePorTokensZoho,
  getAccountId,
  accessTokenPorRefreshToken,
  getAccessToken,
  validarToken
};
