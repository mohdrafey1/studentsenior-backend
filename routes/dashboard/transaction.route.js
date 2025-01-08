const express = require('express');
const router = express.Router();
const transactionController = require('../../controllers/dashboard/transaction.controller');
const wrapAsync = require('../../utils/wrapAsync.js');

router.get('/', wrapAsync(transactionController.getAllTransactions));

module.exports = router;
