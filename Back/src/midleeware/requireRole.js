const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Acceso denegado: No tienes permisos' });
    }
    next();
  };
};

module.exports = {requireRole};