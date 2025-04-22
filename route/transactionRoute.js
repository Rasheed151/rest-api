const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// ✅ Ambil semua transaksi atau berdasarkan ID (via query atau body)
router.get('/', transactionController.getAllTransactions);

// ✅ Buat transaksi baru (insert ke transaction + transaction_detail)
router.post('/', transactionController.createTransaction);

// ✅ Update status pembayaran
router.put('/', transactionController.updatePaymentStatus);

// ✅ Hapus transaksi dan detailnya
router.delete('/', transactionController.deleteTransaction);

module.exports = router;
