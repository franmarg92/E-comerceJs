const requireRole = require ('./requireRole')
const authMidleware = require ('./authMidleWare')
const errorMidleware = require('./errorMidleware')
const sharpMidleware = require('./sharpMidleware')
const multerMidleware = require('./multerMidleware')
module.exports = {requireRole, authMidleware, errorMidleware, sharpMidleware, multerMidleware}