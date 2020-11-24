var express = require('express');
var router = express.Router();
var User = require('../models/user.model');
var jwtAuth = require('../auth/jwt-auth');

/* GET users listing. */
router.get('/', jwtAuth, async (req, res, next) => {
  try {
    res.status(200).json(req.authUser);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.password) {
      res.status(400).json({
        message: 'Invalid inputs'
      });
      return;
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email.toString().trim().toLowerCase()
    });
  
    user.setPassword(req.body.password.toString().trim());

    await user.save();

    res.status(201).json(user);
  } catch (e) {
    res.status(500).json(e)
  }
})

module.exports = router;
