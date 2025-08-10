const addressRouter = require("./addressRoutes");
const cartRouter = require("./cartRoutes");
const categoryRouter = require("./categoryRoutes");
const orderRouter = require("./orderRoutes");
const productRouter = require("./productRoutes");
const roleRouter = require("./roleRoutes");
const userRouter = require('./userRoutes')
const authRouter = require('./authRoutes')
const mercadoPagoRouter = require('./mercadoPagoRoutes');
module.exports = {

  addressRouter,
  cartRouter,
  categoryRouter,
  orderRouter,
  productRouter,
  roleRouter,
  userRouter,
  authRouter,
  mercadoPagoRouter
};
