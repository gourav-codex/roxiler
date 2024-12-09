const axios = require('axios');  // Import axios to fetch data from the external API
const Transaction = require('../models/Transaction');

const getStatistics = async (req, res) => {
  const { month } = req.query;

  if (!month || isNaN(month) || month < 1 || month > 12) {
    return res.status(400).json({ message: 'Invalid month provided' });
  }

  try {
    // Fetch data from third-party API as a fallback
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    const totalAmount = transactions.reduce((acc, curr) => acc + curr.price, 0);
    const totalSoldItems = transactions.filter(item => item.sold).length;
    const totalNotSoldItems = transactions.filter(item => !item.sold).length;

    return res.status(200).json({
      totalAmount,
      totalSoldItems,
      totalNotSoldItems
    });
  } catch (error) {
    console.error('Error fetching data from API:', error.message);
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
};

module.exports = { getStatistics };
