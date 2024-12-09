const axios = require('axios');
const Transaction = require('../models/Transaction');

// List transactions with search, pagination, and month filtering
const listTransactions = async (req, res) => {
  const { page = 1, perPage = 10, search = '', month = null } = req.query;

  try {
    // Fetch external data (product transaction JSON from an API)
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    let externalTransactions = response.data;

    // Filter transactions based on the month if provided
    if (month) {
      externalTransactions = externalTransactions.filter(
        (transaction) => new Date(transaction.dateOfSale).getMonth() + 1 === parseInt(month)
      );
    }

    // If search term is provided, filter based on title or description
    if (search) {
      externalTransactions = externalTransactions.filter(
        (transaction) =>
          transaction.title.toLowerCase().includes(search.toLowerCase()) ||
          transaction.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Paginate the data
    const totalCount = externalTransactions.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const currentPage = Number(page);

    // Slice the data to only return the requested page
    const paginatedTransactions = externalTransactions.slice(
      (currentPage - 1) * perPage,
      currentPage * perPage
    );

    // Send the response
    res.status(200).json({
      transactions: paginatedTransactions,
      totalCount,
      totalPages,
      currentPage,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ message: 'Error fetching transactions', error: error.message });
  }
};

module.exports = { listTransactions };
