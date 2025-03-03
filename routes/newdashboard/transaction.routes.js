const express = require('express');
const {
    verifyDashboardUser,
    requireRole,
} = require('../../utils/verifyDashboardUser');
const wrapAsync = require('../../utils/wrapAsync');
const {
    GetAllTransactions,
    getAllRedemptionRequests,
    getAllAddPointRequests,
} = require('../../controllers/newdashboard/transactions.controller');
const router = express.Router();

router.get(
    '/',
    verifyDashboardUser,
    requireRole(['Admin', 'Moderator']),
    wrapAsync(GetAllTransactions)
);

router.get(
    '/redemption',
    verifyDashboardUser,
    requireRole(['Admin', 'Moderator']),
    wrapAsync(getAllRedemptionRequests)
);

router.get(
    '/add-points',
    verifyDashboardUser,
    requireRole(['Admin', 'Moderator']),
    wrapAsync(getAllAddPointRequests)
);

module.exports = router;
