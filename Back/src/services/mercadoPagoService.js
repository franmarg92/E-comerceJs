const { mercadopago } = require("../helpers/mercadoPagoCliente");
const { Preference } = require("mercadopago");
const { User, Product, Address, Order } = require("../models");
const orderService = require("../services");
const normalizeProductId = require("../helpers/compareIdHelper");

const preferenceClient = new Preference(mercadopago);

const createPreference = async (
  cartItems,
  buyerEmail,
  userId,
  shippingAddressId,
  notes = ""
) => {
  if (!userId || !shippingAddressId || !cartItems?.length) {
    throw new Error("Datos incompletos para generar preferencia");
  }

  const items = cartItems.map((item) => ({
    title: item.name,
    quantity: item.quantity,
    unit_price: item.price,
    currency_id: "ARS",
  }));

  const externalReferencePayload = {
    userId,
    shippingAddressId,
    items: cartItems.map((item) => ({
      productId: normalizeProductId.normalizeProductIds(item.productId),
      quantity: item.quantity,
    })),
    notes,
  };

  console.log("External Reference Payload:", externalReferencePayload);

  const externalReference = encodeURIComponent(
    JSON.stringify(externalReferencePayload)
  );

const preference = {
  items,
  payer: { email: buyerEmail },
  external_reference: externalReference,
  back_urls: {
    success: "https://distinzionejoyas.com/pago-exitoso",
    failure: "https://distinzionejoyas.com/pago-exitoso",
    pending: "",
  },
  auto_return: "approved",
  notification_url: "https://www.distinzionejoyas.com/mercadoPago/webhook" 
};

  const response = await preferenceClient.create({ body: preference });
  return response.init_point;
};
/**
 * Procesa el webhook recibido desde Mercado Pago
 
const processWebhook = async (body) => {
  const { action, data, type } = body;

  // 🛡️ Validación básica
  if (!data?.id || type !== "payment") {
    throw new Error("Payload inválido: falta ID o tipo incorrecto");
  }

  const paymentId = data.id;

  // 🔁 Evitar duplicados
  const existing = await Payment.findOne({ mp_id: paymentId });
  if (existing) {
    return { status: "duplicado", id: paymentId };
  }

  // 📡 Consulta a Mercado Pago
  const mpResponse = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    },
  });

  const paymentData = mpResponse.data;

  // ✅ Validación de estado
  if (paymentData.status !== "approved") {
    return { status: "ignorado", estado: paymentData.status };
  }

  
};*/


module.exports = { createPreference, /*processWebhook*/ };
