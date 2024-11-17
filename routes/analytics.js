

const express = require('express');
const router = express.Router();
const PortfolioItem = require('../models/PortfolioItem');

const { checkAuthenticated, checkTwoFactorAuthenticated, checkAdmin } = require('../middlewares/authorization');


router.get('/analytics', checkAuthenticated, checkTwoFactorAuthenticated, checkAdmin, async (req, res) => {
  try {
    const results = await PortfolioItem.aggregate([
      {
        $group: {
          _id: '$createdBy',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
    ]);

    const labels = results.map((item) => item.user[0].username);
    const data = results.map((item) => item.count);

    res.render('analytics', { labels, data });
  } catch (err) {
    console.error('Error fetching analytics data:', err);
    res.status(500).render('error', { message: 'Error fetching analytics data.' });
  }
});

module.exports = router;