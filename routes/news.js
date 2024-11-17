

const express = require('express');
const router = express.Router();
const axios = require('axios');

const { checkAuthenticated, checkTwoFactorAuthenticated } = require('../middlewares/authorization');


router.get('/news', checkAuthenticated, checkTwoFactorAuthenticated, async (req, res) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    const response = await axios.get(`https://newsapi.org/v2/top-headlines`, {
      params: {
        country: 'us',
        apiKey: apiKey,
      },
    });

    const articles = response.data.articles;

    res.render('news', { articles });
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).render('error', { message: 'Error fetching news articles.' });
  }
});

module.exports = router;
