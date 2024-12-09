const express = require('express');
const mongoose = require('mongoose');
const { listTransactions } = require('./src/controllers/transactionController'); // Import the controller
const router = express.Router();
const cors = require('cors');
require('dotenv').config();

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());  // Allow cross-origin requests
app.use(express.json());  // Parse incoming JSON requests

// Import Routes
const statisticsRoutes = require('./src/routes/statisticsRoutes');
const barChartRoutes = require('./src/routes/barChartRoutes');
const pieChartRoutes = require('./src/routes/pieChartRoutes');
const transactionRoutes = require('./src/routes/transactionRoutes');
const seedRoutes = require('./src/routes/seedRoutes');

// Route to get all transactions with search and pagination
router.get('/transactions', listTransactions);
module.exports = router;

// Use Routes
app.use('/api', statisticsRoutes);
app.use('/api', barChartRoutes);
app.use('/api', pieChartRoutes);
app.use('/api', transactionRoutes);
app.use('/api', seedRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process if DB connection fails
  });

// Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running successfully!' });
});

// Fallback Route for 404 Errors
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start Server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
