const express = require('express');
const paymentController = require('../../controllers/api/payment.controller');
const { verifyToken } = require('../../utils/verifyUser');

const router = express.Router();

router.post('/initiate', verifyToken, paymentController.initiatePayment);

router.get('/verify/:merchantOrderId', paymentController.verifyPayment);

router.get('/:id', verifyToken, paymentController.getPaymentById);

module.exports = router;
