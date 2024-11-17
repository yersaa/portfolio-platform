// routes/marketTrends.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { checkAuthenticated, checkTwoFactorAuthenticated } = require('../middlewares/authorization');

// Determine if the app is in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Route to display stock market trends
router.get('/market-trends', checkAuthenticated, checkTwoFactorAuthenticated, async (req, res) => {
  try {
    let stockData;

    if (isDevelopment) {
      // Use mock data
      const mockDataPath = path.join(__dirname, '..', 'mockData.json');
      const rawData = fs.readFileSync(mockDataPath, 'utf8');
      stockData = JSON.parse(rawData);
    } else {
      // Production code with actual API calls
      const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
      const symbols = ['AAPL', 'GOOGL', 'AMZN']; // Example stock symbols

      const promises = symbols.map(symbol =>
        axios.get('https://www.alphavantage.co/query', {
          params: {
            function: 'TIME_SERIES_DAILY',
            symbol: symbol,
            apikey: apiKey,
          },
        })
      );

      const responses = await Promise.all(promises);

      stockData = responses
        .map((response, index) => {
          const data = response.data;

          // Check for API errors
          if (data['Error Message']) {
            console.error(`Error fetching data for ${symbols[index]}: ${data['Error Message']}`);
            return null;
          }

          if (data['Note']) {
            console.error(`API note for ${symbols[index]}: ${data['Note']}`);
            return null;
          }

          const timeSeries = data['Time Series (Daily)'];

          if (!timeSeries) {
            console.error(`No time series data for symbol: ${symbols[index]}. Full response: ${JSON.stringify(data)}`);
            return null;
          }

          const dates = Object.keys(timeSeries).slice(0, 30).reverse();
          const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));

          return {
            symbol: symbols[index],
            dates,
            prices,
          };
        })
        .filter(stock => stock !== null);

      if (stockData.length === 0) {
        return res.status(500).render('error', { message: 'No stock data available due to API limitations.' });
      }
    }

    res.render('marketTrends', { stockData, error: null });
  } catch (err) {
    console.error('Error fetching stock market trends:', err);
    res.status(500).render('error', { message: 'Error fetching stock market trends.' });
  }
});

module.exports = router;
