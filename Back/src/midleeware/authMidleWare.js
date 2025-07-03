const {passportConfig} = require('../config')

const userIsAuth = (req, res, next) => {
   
    passportConfig.authenticate('jwt-user', {session: false})(req, res, next)
}

const userIsAdmin = (req, res, next) => {
    passportConfig.authenticate('jwt-admin', {session: false})(req, res, next)
}

module.exports = {userIsAuth, userIsAdmin}