// public/js/marketTrends.js

document.addEventListener('DOMContentLoaded', function () {
    const stockData = window.stockData;
  
    stockData.forEach(function (stock) {
      const ctx = document.getElementById('chart-' + stock.symbol).getContext('2d');
      new Chart(ctx, {
        type: 'line', // or stock.chartType if dynamically set
        data: {
          labels: stock.dates,
          datasets: [{
            label: `${stock.symbol} Closing Prices`,
            data: stock.prices,
            borderColor: 'rgba(75, 192, 192, 1)',
            fill: false,
          }],
        },
        options: {
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: 'Date',
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: 'Price (USD)',
              },
            },
          },
        },
      });
    });
  });
  