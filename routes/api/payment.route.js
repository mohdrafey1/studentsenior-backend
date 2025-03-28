const express = require('express');
const {
    handlePaymentInitiation,
    handlePaymentValidation,
    getAllPayments,
    getPaymentById,
    getMyPayments,
} = require('../../controllers/api/payment.controller');
const { verifyToken } = require('../../utils/verifyUser');
const {
    verifyDashboardUser,
    requireRole,
} = require('../../utils/verifyDashboardUser');

const router = express.Router();

// User payment initiation
router.post('/pay', verifyToken, handlePaymentInitiation);

// Payment validation (callback from PhonePe)
router.get('/validate/:merchantTransactionId', handlePaymentValidation);

// Get all payments (Admin only)

router.get(
    '/transactions',
    verifyDashboardUser,
    requireRole(['Admin']),
    getAllPayments
);

// Get payment by ID
router.get('/:id', verifyToken, getPaymentById);

// Get user's own payments
router.get('/', verifyToken, getMyPayments);

module.exports = router;
