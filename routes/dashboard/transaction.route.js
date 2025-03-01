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

router.get('/bonuspoints', wrapAsync(transactionController.bonusPointForm));

router.post('/bonuspoints', wrapAsync(transactionController.bonusPoints));

router.get('/add-points', wrapAsync(transactionController.addPointsRequests));

router.post('/add-points', wrapAsync(transactionController.addPoints));

router.delete(
    '/add-points/:id',
    wrapAsync(transactionController.deleteRequest)
);

module.exports = router;
