const express = require('express');
const User = require('../models/user');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('signup');
  console.log("get")
});

router.post('/', async (req, res) => {
    console.log("post")
  const { userid, password, username, phonenumber } = req.body;
  const user = new User(userid, password, username, phonenumber);

  try {
    await user.save();
    res.redirect('/login');
  } catch (error) {
    res.status(500).send(error.toString());
  }
});

module.exports = router;
