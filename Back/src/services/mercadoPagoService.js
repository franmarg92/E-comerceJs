// Importa directamente el objeto 'preference' que ya tiene el cliente configurado
const { preference } = require("../helpers/mercadoPagoCliente"); 
const { User, Address, Order } = require("../models");
const orderService = require("../services");
const normalizeProductId = require("../helpers/compareIdHelper");

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

  const externalReference = encodeURIComponent(JSON.stringify(externalReferencePayload));

  const body = { // Renombrado a 'body' para evitar la confusión de nombres
    items,
    payer: { email: buyerEmail },
    external_reference: externalReference,
    back_urls: {
      success: "https://distinzionejoyas.com/pago-exitoso",
      failure: "https://distinzionejoyas.com/pago-exitoso",
      pending: "",
    },
    auto_return: "approved",
    notification_url: "https://www.distinzionejoyas.com/api/mercado-pago/webhook",
  };

  // Usa directamente el objeto 'preference' que ya está inicializado
  const response = await preference.create({ body });
  return response.init_point;
};

module.exports = { createPreference };
