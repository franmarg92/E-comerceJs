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
const processWebhook = async (query) => {
  const { type, data } = query;

  if (type !== "payment" || !data?.id) {
    throw new Error("Webhook inválido o sin ID de pago");
  }

  const paymentData = await payment.get({ id: data.id });
  if (!paymentData || paymentData.status !== "approved") {
    throw new Error("Pago no aprobado o no encontrado");
  }

  const reference = decodeURIComponent(paymentData.external_reference);
  const { userId, shippingAddressId, items, notes } = JSON.parse(reference);

  const user = await User.findById?.(userId) || await User.findByPk?.(userId);
  const address = await Address.findById?.(shippingAddressId) || await Address.findByPk?.(shippingAddressId);
  if (!user || !address) {
    throw new Error("Usuario o dirección no válidos");
  }

  const existingOrder = await Order.findOne({ paymentId: paymentData.id });
  if (existingOrder) {
    logger?.warn("Orden ya procesada", { paymentId: paymentData.id });
    return;
  }

  const paymentDetails = {
    transactionId: paymentData.id,
    status: paymentData.status,
    method: paymentData.payment_method_id,
    amount: paymentData.transaction_amount,
    payerEmail: paymentData.payer?.email,
  };

  const newOrder = await orderService.createOrder({
    userId,
    items,
    shippingAddressId,
    paymentDetails,
    notes,
  });


  return newOrder;
};

module.exports = { createPreference, processWebhook };
