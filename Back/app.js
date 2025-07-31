const express = require("express");
require("dotenv").config();
const passport = require("passport");
const cors = require("cors");
const path = require("path");

const { connectDB } = require("./src/config"); // Separado si lo modularizás
const corsConfig = require("./src/config"); // Ideal separar en archivo propio

const {
  authRouter,
  userRouter,
  productRouter,
  categoryRouter,
  cartRouter,
  orderRouter,
  addressRouter,
} = require("./src/routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware general
app.use(express.json());
app.use(cors(corsConfig));
app.use(passport.initialize());

// Logging elegante
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Producción con Coolify + proxy
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // Para SSL detrás de proxy
}

// Servir frontend SPA desde /public
app.use(express.static(path.join(__dirname, '../Front/dist/front/browser')));

// Rutas backend
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/address", addressRouter);

app.get("/api/health", (req, res) => {
  res.status(200).send("OK");
});

// Fallback para frontend SPA (Angular routing)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../Front/dist/front/browser/index.html'));
});

// Start del servidor
app.listen(PORT, async () => {
  await connectDB.initDB();
  console.log(`🟢 Servidor corriendo en puerto ${PORT}`);
});
