const express = require("express");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
require("dotenv").config();

const { connectDB } = require("./src/config");
const corsConfig = require("./src/config");

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

app.use(express.json());
app.use(cors(corsConfig));
app.use(passport.initialize());


 
// Logging básico
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Trust proxy si estás en producción
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// 📂 Servir carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// 🔧 Rutas backend
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/category", categoryRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/address", addressRouter);



// Servir archivos estáticos
app.use('/imgs', express.static(path.join(__dirname, "../Back/src/upload")));


// 🩺 Health check
app.get("/api/health", (req, res) => {
  res.status(200).send("OK");
});

// 🌍 Fallback para SPA en public/index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, async () => {
  await connectDB.initDB();
  console.log(`🟢 Servidor corriendo en puerto ${PORT}`);
});
