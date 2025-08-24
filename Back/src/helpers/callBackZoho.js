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
    const response = await axios.post(
      "https://accounts.zoho.com/oauth/v2/token",
      new URLSearchParams({
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: "refresh_token",
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const data = response.data;

    if (data.access_token) {
      return data.access_token; // válido por 1h
    } else {
      throw new Error(
        "No se pudo obtener access_token: " + JSON.stringify(data)
      );
    }
  } catch (error) {
    console.error(
      "Error al pedir access_token:",
      error.response?.data || error.message
    );
    throw error;
  }
};


let cachedToken = null;
let lastRefresh = 0;


const getAccessToken = async () => {
  const ahora = Date.now();
  if (cachedToken && ahora - lastRefresh < 50 * 60 * 1000) return cachedToken;
  if (ahora - lastRefresh < 60 * 1000)
    throw new Error("Throttle: Esperá un momento");

  cachedToken = await accessTokenPorRefreshToken();
  lastRefresh = ahora;
  return cachedToken;
};

const obtenerAccountId = async (accessToken) => {
  try {
    const response = await axios.get("https://mail.zoho.com/api/accounts", {
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
      },
    });

    const accountId = response.data?.data?.[0]?.accountId;
    if (!accountId) throw new Error("No se encontró accountId 😔");

    return accountId;
  } catch (error) {
    console.error(
      "Error al obtener accountId:",
      error.response?.data || error.message
    );
    throw new Error("Falló la obtención del accountId 💥");
  }
};

module.exports = {
  codePorTokensZoho,
  obtenerAccountId,
  accessTokenPorRefreshToken,
  getAccessToken,
};
