const AddPoint = require('../../models/AddPoint');
const RedemptionRequest = require('../../models/RedemptionRequest');
const Transaction = require('../../models/Transaction');
const Payment = require('../../models/Payment');

module.exports.GetAllTransactions = async (req, res) => {
    const allTransactions = await Transaction.find({})
        .populate('user')
        .sort({ createdAt: -1 });

    res.status(200).json(allTransactions);
};

module.exports.getAllRedemptionRequests = async (req, res) => {
    const allRedemptionRequests = await RedemptionRequest.find({})
        .populate('owner')
        .sort({
            createdAt: -1,
        });

    res.status(200).json(allRedemptionRequests);
};

exports.updateRedemptionRequest = async (req, res) => {
    const redemptionRequestId = req.params.id;
    const newStatus = req.body.status;

    if (!newStatus) {
        return res.status(400).json({ message: 'Status is required' });
    }

    const redemptionRequest = await RedemptionRequest.findByIdAndUpdate(
        redemptionRequestId,
        { status: newStatus },
        { new: true }
    );

    if (!redemptionRequest) {
        return res
            .status(404)
            .json({ message: 'Redemption request not found' });
    }

    res.status(200).json({ message: 'Request Updated Successfully' });
};

module.exports.getAllAddPointRequests = async (req, res) => {
    const allAddPointRequests = await AddPoint.find({}).populate('owner').sort({
        createdAt: -1,
    });

    res.status(200).json(allAddPointRequests);
};

module.exports.getAllOnlinePayments = async (req, res) => {
    const allOnlinePayments = await Payment.find({})
        .populate('user', 'username email')
        .sort({ createdAt: -1 });

    res.status(200).json(allOnlinePayments);
};

const MODEL_MAP = {
    note_purchase: 'Notes',
    pyq_purchase: 'NewPyq',
    course_purchase: 'PaidCourse',
};

module.exports.getPaymentById = async (req, res) => {
    try {
        // First find the payment by merchantOrderId
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found',
            });
        }

        // Populate based on payment type
        const populatedPayment = await Payment.populate(payment, {
            path: 'purchaseItemId',
            model: MODEL_MAP[payment.typeOfPurchase],
            select: '-__v', // Exclude version key if needed
        });

        // Additional population if needed (e.g., user details)
        await Payment.populate(populatedPayment, {
            path: 'user',
            select: 'username email', // Only include necessary fields
        });

        res.status(200).json({
            success: true,
            data: populatedPayment,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching payment',
            error: error.message,
        });
    }
};
