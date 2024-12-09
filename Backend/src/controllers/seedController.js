const Transaction = require('../models/Transaction');

// Seed database with mock data
const seedDatabase = async (req, res) => {
  try {
    // Generate some mock transaction data with random dates
    const transactions = Array.from({ length: 50 }).map(() => {
      const month = Math.floor(Math.random() * 12) + 1; // Random month between 1-12
      const year = 2024; // Year can be set to any value
      const randomPrice = Math.floor(Math.random() * 500) + 1;
      const randomSold = Math.random() < 0.5; // Random boolean for sold status

      return {
        title: `Product ${Math.floor(Math.random() * 100)}`,
        description: `Description for product ${Math.floor(Math.random() * 100)}`,
        price: randomPrice,
        category: ['Electronics', 'Clothing', 'Food', 'Books'][Math.floor(Math.random() * 4)],
        dateOfSale: new Date(year, month - 1, Math.floor(Math.random() * 28) + 1), // Random day in the given month
        sold: randomSold
      };
    });

    // Insert the mock transactions into the database
    await Transaction.insertMany(transactions);

    res.status(200).json({ message: 'Database seeded successfully!' });
  } catch (error) {
    console.error('Error seeding database:', error.message);
    res.status(500).json({ message: 'Error seeding database', error: error.message });
  }
};

module.exports = { seedDatabase };
