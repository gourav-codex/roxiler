const axios = require('axios');  
const Transaction = require('../models/Transaction');

const getPieChartData = async (req, res) => {
  const { month } = req.query;

  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ message: 'Invalid month provided' });
  }

  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    // Filter transactions by month (ignoring year)
    const filteredTransactions = transactions.filter(transaction => {
      const transactionMonth = new Date(transaction.dateOfSale).getMonth() + 1; // Months are 0-indexed
      return transactionMonth === parseInt(month);
    });

    const categoryCounts = filteredTransactions.reduce((acc, curr) => {
      if (curr.category) {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
      }
      return acc;
    }, {});

    const pieChartData = Object.keys(categoryCounts).map((category) => ({
      category,
      count: categoryCounts[category]
    }));

    res.status(200).json(pieChartData);
  } catch (error) {
    console.error('Error fetching pie chart data:', error.message);
    res.status(500).json({ message: 'Error fetching pie chart data', error: error.message });
  }
};

module.exports = { getPieChartData };
