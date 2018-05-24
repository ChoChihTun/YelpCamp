const express = require('express');
const passport = require('passport');

const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res) => {
  res.render('landing');
});

// ===============
// AUTH ROUTES
// ===============

// Show register form
router.get('/register', (req, res) => {
  res.render('register');
});

// Handle sign up logic
router.post('/register', (req, res) => {
  const newUser = new User({
    username: req.body.username,
  });
  User.register(newUser, req.body.password, (err) => {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    return passport.authenticate('local')(req, res, () => {
      res.redirect('/campgrounds');
    });
  });
});

// Show login form
router.get('/login', (req, res) => {
  res.render('login');
});

// Handling login logic
router.post('/login', passport.authenticate('local', { // middleware: codes that we run before the callback function
  successRedirect: '/campgrounds',
  failureRedirect: '/login',
}));

// Logout
router.get('/logout', (req, res) => {
  req.logout(); // Destroying user data in this session
  res.redirect('/campgrounds');
});

module.exports = router;
