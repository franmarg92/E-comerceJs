const jwt = require('jsonwebtoken');
require("dotenv").config();

const generateJWT = (payload) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('La variable JWT_SECRET no está definida en el entorno');
  }

  return jwt.sign(payload, secret, {
    expiresIn: '2d',
  });
};

module.exports = { generateJWT };
