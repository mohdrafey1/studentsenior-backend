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
    getAllOnlinePayments,
    getPaymentById,
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

router.get(
    '/all-payments',
    verifyDashboardUser,
    requireRole(['Admin', 'Moderator']),
    wrapAsync(getAllOnlinePayments)
);

router.get(
    '/payments/:id',
    verifyDashboardUser,
    requireRole(['Admin']),
    wrapAsync(getPaymentById)
);

module.exports = router;
