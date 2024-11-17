

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const {
  checkAuthenticated,
  checkTwoFactorAuthenticated,
  checkAdmin,
} = require('../middlewares/authorization');


router.get(
  '/admin',
  checkAuthenticated,
  checkTwoFactorAuthenticated,
  checkAdmin,
  (req, res) => {
    res.render('admin/dashboard');
  }
);

router.get(
  '/admin/users',
  checkAuthenticated,
  checkTwoFactorAuthenticated,
  checkAdmin,
  async (req, res) => {
    try {
      const users = await User.find();
      res.render('admin/users', { users });
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { message: 'Error fetching users.' });
    }
  }
);


router.post(
  '/admin/users/:id/role',
  checkAuthenticated,
  checkTwoFactorAuthenticated,
  checkAdmin,
  async (req, res) => {
    const { role } = req.body;
    if (!['admin', 'editor'].includes(role)) {
      return res.status(400).render('error', {
        message: 'Invalid role specified.',
      });
    }
    try {
      await User.findByIdAndUpdate(req.params.id, { role });
      res.redirect('/admin/users');
    } catch (err) {
      console.error(err);
      res.status(500).render('error', { message: 'Error updating user role.' });
    }
  }
);

module.exports = router;
