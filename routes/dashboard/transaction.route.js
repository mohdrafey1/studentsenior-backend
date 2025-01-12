const express = require('express');
const router = express.Router();
const transactionController = require('../../controllers/dashboard/transaction.controller');
const wrapAsync = require('../../utils/wrapAsync.js');

router.get('/', wrapAsync(transactionController.getAllTransactions));

router.get(
    '/redemptionrequests',
    wrapAsync(transactionController.getAllRequestRedemption)
);

router.post(
    '/redemption/update-status/:id',
    wrapAsync(transactionController.updateRedemptionRequest)
);

module.exports = router;
