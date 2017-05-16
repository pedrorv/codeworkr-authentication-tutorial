const express = require('express');
const router = express.Router();

router.route('/register')
  .get((req, res) => {
    res.render('register');
  });

router.route('/login')
  .get((req, res) => {
    res.render('login');
  });

module.exports = router;