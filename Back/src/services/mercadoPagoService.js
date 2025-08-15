const { preference, payment } = require("../helpers/mercadoPagoCliente");
const orderService = require("../services/orderService");
const normalizeProductId = require("../helpers/compareIdHelper");
const cartService = require("../services/cartService");
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

  const externalReference = encodeURIComponent(
    JSON.stringify(externalReferencePayload)
  );

  const preferenceData = {
    items,
    payer: { email: buyerEmail },
    external_reference: externalReference,
    back_urls: {
      success: "https://distinzionejoyas.com/pago-exitoso",
      failure: "https://distinzionejoyas.com/pago-fallido",
      pending: "https://distinzionejoyas.com/pago-pendiente",
    },
    auto_return: "approved",
    notification_url: "https://distinzionejoyas.com/api/mercadoPago/webhook",
  };

  const response = await preference.create({ body: preferenceData });
  return response.init_point;
};

const processWebhookEvent = async (query, body) => {
 

 
  let paymentId;
  let paymentStatus;
  console.log("🔔 Webhook recibido:", query)
  console.log("🔔 Webhook body:", body);

  // MP puede mandar el id en distintas formas
  if (query["data.id"]) {
    paymentId = query["data.id"];
    console.log("📩 Webhook recibido:", query, body);
  } 
  /*
   else if (query.id && topic === "payment") {
    paymentId = query.id;
    console.log("📩 Webhook2 recibido:", query, body);
  } 
  else if (body?.data?.id) {
    paymentId = body.data.id;
  }
 
  // 🔒 Filtro defensivo: ignorar si no es de tipo payment o falta paymentId
  if ((topic !== "payment" && type !== "payment") || !paymentId) {
    console.log("⏸️ Webhook ignorado: no es de tipo payment o falta paymentId");
    return;
  }

  if (!paymentId) {
    console.warn("⚠️ No se recibió paymentId");
    return;
  }*/

  // Obtener detalles del pago desde MP
  const paymentData = await payment.get({ id: paymentId });

  console.log("🧾 Detalles del pago recibidos:", paymentId);

  if (paymentData.status === "approved") {
    // Decodificar external_reference
    const decoded = decodeURIComponent(paymentData.external_reference);
    const orderData = JSON.parse(decoded);

    paymentStatus = paymentData.status;

    const enrichedOrderData = {
      ...orderData,
      paymentId,
      paymentStatus
    };

    // Guardar orden en la DB
    await orderService.createOrder(enrichedOrderData);

    console.log("✅ Orden guardada y stock actualizado");
  }

  await cartService.deleteCartByUserId(orderData.userId);
  console.log("🧹 Carrito eliminado para el usuario:", orderData.userId);
};


module.exports = { createPreference, processWebhookEvent };
