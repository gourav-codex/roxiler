const axios = require('axios');
const Transaction = require('../models/Transaction');

const getBarChartData = async (req, res) => {
  const { month } = req.query;

  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ message: 'Invalid month provided' });
  }

  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    // Filter transactions by month (ignoring the year)
    const filteredTransactions = transactions.filter(transaction => {
      const transactionMonth = new Date(transaction.dateOfSale).getMonth() + 1; // Months are 0-indexed
      return transactionMonth === parseInt(month);
    });

    // Group data by price ranges or other logic
    const ranges = ['0-50', '51-100', '101-200', '201-500', '500+'];  // Example ranges
    const categoryCounts = ranges.reduce((acc, range) => {
      acc[range] = filteredTransactions.filter(transaction => {
        const price = transaction.price;
        if (range === '0-50') return price <= 50;
        if (range === '51-100') return price > 50 && price <= 100;
        if (range === '101-200') return price > 100 && price <= 200;
        if (range === '201-500') return price > 200 && price <= 500;
        return price > 500;
      }).length;
      return acc;
    }, {});

    const barChartData = Object.keys(categoryCounts).map((range) => ({
      range,
      count: categoryCounts[range]
    }));

    res.status(200).json(barChartData);
  } catch (error) {
    console.error('Error fetching bar chart data:', error.message);
    res.status(500).json({ message: 'Error fetching bar chart data', error: error.message });
  }
};

module.exports = { getBarChartData };
