const registerRouter = require("./registerRoutes");
const loginRouter = require("./loginRoutes");
const addressRouter = require("./addressRoutes");
const cartRouter = require("./cartRoutes");
const categoryRouter = require("./categoryRoutes");
const orderRouter = require("./orderRoutes");
const productRouter = require("./productRoutes");
const roleRouter = require("./roleRoutes");
const userRouter = require('./userRoutes')
module.exports = {
  registerRouter,
  loginRouter,
  addressRouter,
  cartRouter,
  categoryRouter,
  orderRouter,
  productRouter,
  roleRouter,
  userRouter,
};
