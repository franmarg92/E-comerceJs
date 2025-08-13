const { MercadoPagoConfig, Payment, Preference } = require("mercadopago");
const { User, Product, Address, Order } = require("../models");
const orderService = require("../services");
const normalizeProductId = require("../helpers/compareIdHelper");

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
const paymentClient = new Payment(client);
const preferenceClient = new Preference(client);

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const createPreference = async (cartItems, buyerEmail, userId, shippingAddressId, notes = "") => {
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

  const externalReference = encodeURIComponent(JSON.stringify(externalReferencePayload));

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
    notification_url: "https://www.distinzionejoyas.com/api/mercadoPago/webhook",
  };

  const response = await preferenceClient.create({ body: preference });
  return response.init_point;
};

const processApprovedPayment = async (paymentId, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const payment = await paymentClient.get({ id: paymentId });

      if (!payment?.body) throw new Error("No body en respuesta de pago");

      const { status, external_reference, transaction_amount, payment_method_id } = payment.body;

      if (status !== "approved") {
        console.warn("⚠️ Pago no aprobado:", status);
        return;
      }

      if (!external_reference) {
        console.error("Falta external_reference en el pago:", paymentId);
        return;
      }

      let decoded;
      try {
        decoded = JSON.parse(decodeURIComponent(external_reference));
      } catch (err) {
        console.error("No se pudo parsear external_reference:", err);
        return;
      }

      const { userId, shippingAddressId, items, notes } = decoded;

      if (!userId || !shippingAddressId) {
        console.error("userId o shippingAddressId faltan en external_reference");
        return;
      }

      const user = await User.findById(userId);
      const address = await Address.findById(shippingAddressId);

      if (!user || !address) {
        console.error("Usuario o dirección no válidos");
        return;
      }

      const existingOrder = await Order.findOne({ "paymentDetails.transactionId": paymentId });
      if (existingOrder) {
        console.log("🔁 Orden ya existe:", existingOrder._id);
        return;
      }

      const order = await orderService.createOrder({
        userId,
        items,
        shippingAddressId,
        notes,
        paymentDetails: {
          method: payment_method_id,
          transactionId: paymentId,
          transactionAmount: transaction_amount,
          status,
          raw: payment.body,
        },
      });

      console.log("✅ Orden creada:", order._id);
      return;
    } catch (err) {
      console.error(`❌ Intento ${attempt} fallido para paymentId ${paymentId}:`, err);
      if (attempt < retries) await delay(1000);
      else throw err;
    }
  }
};

module.exports = { createPreference, processApprovedPayment };
