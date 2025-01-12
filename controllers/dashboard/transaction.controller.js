const Transaction = require('../../models/Transaction.js');
const RedemptionRequest = require('../../models/RedemptionRequest.js');

exports.getAllTransactions = async (req, res) => {
    const transactions = await Transaction.find()
        .populate('user')
        .populate('resourceId')
        .sort({ createdAt: -1 });
    res.render('transaction/index', { transactions });
};

exports.getAllRequestRedemption = async (req, res) => {
    const allRedemptions = await RedemptionRequest.find({}).populate('owner');

    res.render('transaction/redemptionRequest', { allRedemptions });
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

    res.redirect('/transactions/redemptionrequests');
};
