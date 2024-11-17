// routes/auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');
const { checkAuthenticated, checkNotAuthenticated, checkTwoFactorAuthenticated } = require('../middlewares/authorization');

// Register Route
router.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register');
});

router.post('/register', checkNotAuthenticated, async (req, res) => {
  const { username, email, password, firstName, lastName, age, gender } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      age,
      gender,
      role: 'editor', // Assign 'editor' role by default
    });

    await newUser.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.redirect('/register');
  }
});

// Login Route
router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login', { messages: req.flash('error') });
});

router.post(
  '/login',
  checkNotAuthenticated,
  passport.authenticate('local', {
    successRedirect: '/2fa/verify', // Redirect to 2FA verification after login
    failureRedirect: '/login',
    failureFlash: true,
  })
);

// Dashboard Route
router.get('/dashboard', checkAuthenticated, checkTwoFactorAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user });
});

// Logout Route
router.delete('/logout', (req, res) => {
  req.logOut(() => {
    res.redirect('/login');
  });
});

// 2FA Setup Route
router.get('/2fa/setup', checkAuthenticated, (req, res) => {
  const secret = speakeasy.generateSecret({ length: 20 });

  // Generate the OTP Auth URL
  const otpAuthUrl = speakeasy.otpauthURL({
    secret: secret.base32,
    label: `YourApp:${req.user.username}`,
    encoding: 'base32',
  });

  qrcode.toDataURL(otpAuthUrl, (err, data_url) => {
    if (err) {
      console.error('Error generating QR code:', err);
      res.status(500).render('error', { message: 'Error setting up 2FA.' });
    } else {
      req.session.tempSecret = secret.base32;
      res.render('2fa_setup', { qrCode: data_url, message: null });
    }
  });
});

router.post('/2fa/setup', checkAuthenticated, (req, res) => {
  const { token } = req.body;
  const tempSecret = req.session.tempSecret;

  const verified = speakeasy.totp.verify({
    secret: tempSecret,
    encoding: 'base32',
    token,
  });

  if (verified) {
    req.user.twoFactorSecret = tempSecret;
    req.user.save();
    delete req.session.tempSecret;
    res.redirect('/dashboard');
  } else {
    // Regenerate the QR code
    const otpAuthUrl = speakeasy.otpauthURL({
      secret: tempSecret,
      label: `YourApp:${req.user.username}`,
      encoding: 'base32',
    });

    qrcode.toDataURL(otpAuthUrl, (err, data_url) => {
      if (err) {
        console.error('Error generating QR code:', err);
        res.status(500).render('error', { message: 'Error setting up 2FA.' });
      } else {
        res.render('2fa_setup', {
          qrCode: data_url,
          message: 'Invalid token, please try again.',
        });
      }
    });
  }
});

// 2FA Verification Route
router.get('/2fa/verify', checkAuthenticated, (req, res) => {
  // If 2FA is not set up, redirect to setup
  if (!req.user.twoFactorSecret) {
    return res.redirect('/2fa/setup');
  }
  res.render('2fa_verify', { message: null });
});

router.post('/2fa/verify', checkAuthenticated, (req, res) => {
  const { token } = req.body;

  const verified = speakeasy.totp.verify({
    secret: req.user.twoFactorSecret,
    encoding: 'base32',
    token,
  });

  if (verified) {
    req.session.twoFactorAuthenticated = true;
    res.redirect('/dashboard');
  } else {
    res.render('2fa_verify', { message: 'Invalid token, please try again.' });
  }
});

module.exports = router;
