const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/user')
const { comparePasswords } = require('../utils/password')

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(error => done(error, null))
})

passport.use(
  'local', 
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password', 
      passReqToCallback: false
    },
    (email, password, done) => {
      User.findOne({ 'email': email })
        .then(user => {
          if (!user) return done(null, false, { message: 'Unknown user.' })

          comparePasswords(password, user.password)
            .then(ok => ok ? done(null, user) : done(null, false, { message: 'Password is invalid.' }))
            .catch(error => done(error, null))
        })
        .catch(error => done(error, null))
    }
  )
)