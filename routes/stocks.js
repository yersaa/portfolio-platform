

const express = require('express');
const router = express.Router();
const axios = require('axios');

const { checkAuthenticated, checkTwoFactorAuthenticated } = require('../middlewares/authorization');


router.get('/stocks', checkAuthenticated, checkTwoFactorAuthenticated, (req, res) => {
  res.render('stocks', { stockData: null, error: null });
});

router.post('/stocks', checkAuthenticated, checkTwoFactorAuthenticated, async (req, res) => {
  const { symbol } = req.body;

  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    const response = await axios.get(`https://www.alphavantage.co/query`, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        apikey: apiKey,
      },
    });

    const data = response.data;

    if (data['Error Message']) {
      return res.render('stocks', { stockData: null, error: 'Invalid symbol. Please try again.' });
    }

    const timeSeries = data['Time Series (Daily)'];

    const dates = Object.keys(timeSeries).slice(0, 30).reverse();
    const prices = dates.map((date) => parseFloat(timeSeries[date]['4. close']));

    const stockData = {
      symbol: symbol.toUpperCase(),
      dates,
      prices,
    };

    res.render('stocks', { stockData, error: null });
  } catch (err) {
    console.error('Error fetching stock data:', err);
    res.status(500).render('error', { message: 'Error fetching stock data.' });
  }
});

module.exports = router;
