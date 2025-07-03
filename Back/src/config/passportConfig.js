const passport = require('passport')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const extractJWT = passportJWT.ExtractJwt
require('dotenv').config(); 

const options = {
  jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET 
};

passport.use('jwt-user', new JWTStrategy(options, (jwtPayload, done) => {
    try {
        if (jwtPayload) {
            console.log(jwtPayload)
            return done(null, jwtPayload)
        }
        return done(null, false)
    } catch (error) {
        return done(error, false)
    }
}))

passport.use('jwt-admin', new JWTStrategy(options, (jwtPayload, done) => {
    try {
        if (jwtPayload.role === "admin") {
            console.log(jwtPayload)
            return done(null, jwtPayload)
        }
        return done(null, false)
    } catch (error) {
        return done(error, false)
    }
}))






module.exports = passport;
