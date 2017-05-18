const express = require('express');
const router = express.Router();
const Joi = require('joi')

const User = require('../models/user')
const { hashPassword } = require('../utils/password')

const userSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
  confirmationPassword: Joi.any().valid(Joi.ref('password')).required()
})

router.route('/register')
  .get((req, res) => {
    res.render('register');
  })
  .post((req, res, next) => {
    const result = Joi.validate(req.body, userSchema)

    if (result.error) {
      req.flash('error', 'Data is not valid. Please try again.')
      req.redirect('/users/register')
      return
    }

    User.findOne({ 'email': result.value.email })
      .then(user => {
        if (user) {
          req.flash('error', 'Email is already in use.')
          res.redirect('/users/register')
          return
        }

        return hashPassword(result.value.password)
      })
      .then(hashedPassword => {
        delete result.value.confirmationPassword;
        result.value.password = hashedPassword
        
        return User.create(result.value)
      })
      .then(newUser => {
        req.flash('success', `Welcome, ${newUser.username}!`)
        res.redirect('/users/login')
      })
      .catch(next)
  })

router.route('/login')
  .get((req, res) => {
    res.render('login');
  });

module.exports = router;