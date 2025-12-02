const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.render('register', { error: 'All fields are required' });
  }

  try {
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      const msg = existing.username === username ? 'Username taken' : 'Email already registered';
      return res.render('register', { error: msg });
    }

    const user = new User({ username, email, password });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    res.render('register', { error: 'Server error' });
  }
});

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.render('login', { error: 'Invalid credentials' });
    }

    req.session.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email
    };

    res.redirect('/dashboard');
  } catch (err) {
    res.render('login', { error: 'Server error' });
  }
});

router.get('/logout', (req, res) => {
  req.session.reset();
  res.redirect('/login');
});

module.exports = router;  