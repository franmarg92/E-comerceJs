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

const processApprovedPayment = async (paymentId) => {
  const payment = await mercadopago.payment.findById(paymentId);
  const { status, external_reference, transaction_amount, payment_method_id } =
    payment.body;
  console.log("📦 Procesando pago:", {
    paymentId,
    status,
  });

  if (status !== "approved") {
    console.log("⚠️ Pago no aprobado:", status);
    return;
  }

  const decoded = JSON.parse(decodeURIComponent(external_reference));
  const { userId, shippingAddressId, items, notes } = decoded;

  const user = await User.findById(userId);
  const address = await Address.findById(shippingAddressId);
  if (!user || !address) throw new Error("Usuario o dirección no válidos");

  const existingOrder = await Order.findOne({ paymentId });
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
};

module.exports = { createPreference, processApprovedPayment };
