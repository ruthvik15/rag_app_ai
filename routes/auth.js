const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User')
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email });

  if (existing) {
    return res.render('register', { errorMessage: 'User already exists' });
  }


  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  req.session.userId = newUser._id;
  res.redirect('/dashboard');
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.render('login', { errorMessage: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.render('login', { errorMessage: 'Incorrect password' });
  }

  req.session.userId = user._id;
  res.redirect('/dashboard');
});
module.exports = router;
