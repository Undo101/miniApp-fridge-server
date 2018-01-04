// passport-jwt json-web 身份验证
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const mongoose = require('mongoose')
const User = mongoose.model('User')
const config = require('./config')

module.exports = function (passport) {
    const opts = {}
    opts.jwtFormRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
    opts.secretOrKey = config.secret
    opts.passReqToCallback = true
    passport.use(new JwtStrategy(opts, function (req, jwtPayload, done) {
        User.findOne({_id: jwtPayload._doc._id}, function (err, user) {
            if (err) {
                return done(err, false)
            }
            if (user) {
                done(null, user)
            } else {
                done(null, false)
            }
        })
    }))
}