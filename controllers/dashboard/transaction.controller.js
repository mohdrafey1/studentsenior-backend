const Transaction = require('../../models/Transaction.js');
const RedemptionRequest = require('../../models/RedemptionRequest.js');
const Client = require('../../models/Client.js');
const AddPoint = require('../../models/AddPoint.js');

exports.getAllTransactions = async (req, res) => {
    const transactions = await Transaction.find()
        .populate('user')
        .populate('resourceId')
        .sort({ createdAt: -1 });
    res.render('transaction/index', { transactions });
};

exports.getAllRequestRedemption = async (req, res) => {
    const allRedemptions = await RedemptionRequest.find({})
        .sort({ createdAt: -1 })
        .populate('owner');

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

module.exports.addPointsRequests = async (req, res) => {
    const requests = await AddPoint.find().populate('owner');
    res.render('transaction/addPointsRequest', {
        title: 'Pending Points Requests',
        requests,
    });
};

module.exports.addPoints = async (req, res) => {
    const { requestId } = req.body;

    const request = await AddPoint.findById(requestId);
    if (!request) {
        return res.status(404).send('Request not found');
    }

    if (request.status === true) {
        return res.status(400).send('Points already added for this request');
    }

    const user = await Client.findById(request.owner);
    if (!user) {
        return res.status(404).send('User not found');
    }

    // Add points to the user's reward balance
    user.rewardBalance += request.pointsAdded;
    await user.save();

    // Update request status to 'processed'
    request.status = true;
    await request.save();

    // Create a transaction record
    const transaction = new Transaction({
        user: request.owner,
        type: 'add-point',
        points: request.pointsAdded,
    });

    await transaction.save();

    // Flash success message
    req.flash('success', 'Points Added Successfully');
    res.redirect('/transactions/add-points'); // Redirect after processing
};
