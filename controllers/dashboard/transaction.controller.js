const Transaction = require('../../models/Transaction.js');
const RedemptionRequest = require('../../models/RedemptionRequest.js');
const Client = require('../../models/Client.js');

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

module.exports.bonusPointForm = async (req, res, next) => {
    const users = await Client.find({});

    res.render('transaction/bonuspoints', { users });
};

module.exports.bonusPoints = async (req, res, next) => {
    const { point, client } = req.body;

    const pointsToAdd = Number(point);

    const existingClient = await Client.findById(client);
    if (!existingClient) {
        req.flash('error', 'Client not found');
        return res.redirect('/transactions/bonuspoints');
    }

    existingClient.rewardBalance += pointsToAdd;
    existingClient.rewardPoints += pointsToAdd;
    await existingClient.save();

    const transaction = new Transaction({
        user: client,
        type: 'bonus',
        points: pointsToAdd,
    });

    await transaction.save();

    req.flash('success', 'Bonus Created Successfully');
    res.redirect('/transactions/bonuspoints');
};
