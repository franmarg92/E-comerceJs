const requireRole = require ('./requireRole')
const authMidleware = require ('./authMidleWare')
const errorMidleware = require('./errorMidleware')

module.exports = {requireRole, authMidleware, errorMidleware}