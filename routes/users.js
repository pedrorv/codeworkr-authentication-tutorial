const express = require('express');
const router = express.Router();
const Joi = require('joi')

const User = require('../models/user')

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
      })
      .catch(next)
  })

router.route('/login')
  .get((req, res) => {
    res.render('login');
  });

module.exports = router;