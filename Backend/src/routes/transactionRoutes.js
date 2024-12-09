// transactionRoutes.js

const express = require('express');
const { listTransactions } = require('../controllers/transactionController');
const router = express.Router();

router.get('/transactions', listTransactions);

module.exports = router;

