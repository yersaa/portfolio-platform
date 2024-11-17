// routes/visualization.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { checkAuthenticated, checkTwoFactorAuthenticated, checkEditor } = require('../middlewares/authorization');

const isDevelopment = process.env.NODE_ENV === 'development';

// Display form to create a custom visualization
router.get('/visualization/create', checkAuthenticated, checkTwoFactorAuthenticated, checkEditor, (req, res) => {
  res.render('createVisualization', { error: null });
});

// Handle form submission and display the visualization
router.post('/visualization/create', checkAuthenticated, checkTwoFactorAuthenticated, checkEditor, async (req, res) => {
  const { symbol, chartType } = req.body;

  try {
    let data;

    if (isDevelopment) {
      // Use mock data for development
      const mockDataPath = path.join(__dirname, '..', 'mockData.json');
      const rawData = fs.readFileSync(mockDataPath, 'utf8');
      const mockStockData = JSON.parse(rawData).find(stock => stock.symbol.toUpperCase() === symbol.toUpperCase());

      if (!mockStockData) {
        return res.render('createVisualization', { error: 'Invalid symbol. Please try again.' });
      }

      data = mockStockData;
    } else {
      // Production code with actual API calls
      const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: symbol,
          apikey: apiKey,
        },
      });

      const apiResponse = response.data;

      // Check for API errors
      if (apiResponse['Error Message']) {
        return res.render('createVisualization', { error: 'Invalid symbol. Please try again.' });
      }

      if (apiResponse['Note']) {
        return res.render('createVisualization', { error: 'API call limit reached. Please wait and try again later.' });
      }

      const timeSeries = apiResponse['Time Series (Daily)'];

      if (!timeSeries) {
        console.error(`No time series data for symbol: ${symbol}. Full response: ${JSON.stringify(apiResponse)}`);
        return res.render('createVisualization', { error: 'No data available for this symbol.' });
      }

      const dates = Object.keys(timeSeries).slice(0, 30).reverse();
      const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));

      data = {
        symbol: symbol.toUpperCase(),
        dates,
        prices,
        chartType,
      };
    }

    // If using mock data, set chartType appropriately
    if (isDevelopment) {
      data.chartType = chartType;
    }

    res.render('displayVisualization', { stockData: data, error: null });
  } catch (err) {
    console.error('Error fetching stock data:', err);
    res.status(500).render('error', { message: 'Error fetching stock data.' });
  }
});

module.exports = router;
