const AddPoint = require('../../models/AddPoint');
const RedemptionRequest = require('../../models/RedemptionRequest');
const Transaction = require('../../models/Transaction');

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

module.exports.getAllAddPointRequests = async (req, res) => {
    const allAddPointRequests = await AddPoint.find({}).populate('owner').sort({
        createdAt: -1,
    });

    res.status(200).json(allAddPointRequests);
};
