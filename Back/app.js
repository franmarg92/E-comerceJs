const express = require("express");
require("dotenv").config();
const passport = require("passport");
const cors = require("cors");
const { connectDB } = require("./src/config");
const corsConfig = require('./src/config')

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors(corsConfig));
app.use(passport.initialize());

app.listen(PORT, async () => {
  await connectDB.initDB();
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
