// public/js/visualization.js

document.addEventListener('DOMContentLoaded', function () {
    const stockData = window.stockData;
  
    const ctx = document.getElementById('customChart').getContext('2d');
    new Chart(ctx, {
      type: stockData.chartType, // e.g., 'line', 'bar', etc.
      data: {
        labels: stockData.dates,
        datasets: [{
          label: `${stockData.symbol} Closing Prices`,
          data: stockData.prices,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: stockData.chartType !== 'line', // Fill for non-line charts
        }],
      },
      options: {
        scales: {
          x: {
            display: stockData.chartType !== 'pie' && stockData.chartType !== 'doughnut',
            title: {
              display: stockData.chartType !== 'pie' && stockData.chartType !== 'doughnut',
              text: 'Date',
            },
          },
          y: {
            display: stockData.chartType !== 'pie' && stockData.chartType !== 'doughnut',
            title: {
              display: stockData.chartType !== 'pie' && stockData.chartType !== 'doughnut',
              text: 'Price (USD)',
            },
            beginAtZero: true,
          },
        },
      },
    });
  });
  