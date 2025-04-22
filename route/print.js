const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/printController');

// ✅ Ambil semua transaksi atau berdasarkan ID (via query atau body)
router.get('/', transactionController.getAllTransactions);

module.exports = router;