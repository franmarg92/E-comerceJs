const { preference, payment } = require("../helpers/mercadoPagoCliente");
const { User, Address, Product, Order } = require("../models");
const orderService = require("../services/orderService");
const normalizeProductId = require("../helpers/compareIdHelper");


/**
 * Crea una preferencia de pago en Mercado Pago
 */
const createPreference = async (cartItems, buyerEmail, userId, shippingAddressId, notes = "") => {
  if (!userId || !shippingAddressId || !Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error("Datos incompletos para generar preferencia");
  }

  const items = cartItems.map((item) => {
    if (!item.name || !item.quantity || !item.price) {
      throw new Error("Item del carrito incompleto");
    }

    return {
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: "ARS",
    };
  });

  const externalReferencePayload = {
    userId,
    shippingAddressId,
    items: cartItems.map((item) => ({
      productId: normalizeProductId.normalizeProductIds(item.productId),
      quantity: item.quantity,
      variant: item.variant || {},
    })),
    notes,
  };

  const externalReference = encodeURIComponent(JSON.stringify(externalReferencePayload));

  const body = {
    items,
    payer: { email: buyerEmail },
    external_reference: externalReference,
    back_urls: {
      success: "https://distinzionejoyas.com/pago-exitoso",
      failure: "https://distinzionejoyas.com/pago-exitoso",
      pending: "",
    },
    auto_return: "approved",
    notification_url: "https://www.distinzionejoyas.com/api/mercadoPago/webhook",
  };

  const response = await preference.create({ body });
  if (!response?.init_point) {
    throw new Error("No se pudo generar el init_point");
  }

  return response.init_point;
};

/**
 * Procesa el webhook recibido desde Mercado Pago
 */
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

  // 🧾 Persistencia
  const newPayment = new payment({
    mp_id: paymentId,
    status: paymentData.status,
    amount: paymentData.transaction_amount,
    payer_email: paymentData.payer?.email,
    created_at: new Date(),
  });

  await newPayment.save();

  return { status: "procesado", id: paymentId };
};


module.exports = { createPreference, processWebhook };
