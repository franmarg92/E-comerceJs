// 🌐 Importaciones
const express = require("express");
const path = require("path");
const passport = require("passport");
const cors = require("cors");
require("dotenv").config();

// ⚙️ Configuración y conexión
const { connectDB } = require("./src/config");
const corsConfig = require("./src/config");

// 🧭 Rutas backend
const {
  authRouter,
  userRouter,
  productRouter,
  categoryRouter,
  cartRouter,
  orderRouter,
  addressRouter,
} = require("./src/routes");

// 🚀 Inicializar Express
const app = express();
const PORT = process.env.PORT || 3000;

// 🛡️ Middlewares
app.use(express.json());
app.use(cors(corsConfig));
app.use(passport.initialize());

// 🧾 Logging simple
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// 🌐 Trust proxy en producción (Coolify)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// 🖼️ Servir frontend Angular compilado
const frontendPath = path.join(__dirname, "../Front/dist/front/browser");
app.use(express.static(frontendPath));

// ⚙️ Rutas backend
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/address", addressRouter);

// 🩺 Endpoint de salud
app.get("/api/health", (req, res) => {
  res.status(200).send("OK");
});

// 🪐 Fallback de rutas (SPA Angular)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// 🔌 Inicializar servidor
app.listen(PORT, async () => {
  await connectDB.initDB();
  console.log(`🟢 Servidor corriendo en puerto ${PORT}`);
});
