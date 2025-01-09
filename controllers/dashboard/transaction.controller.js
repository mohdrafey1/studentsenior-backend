const Transaction = require('../../models/Transaction.js');

exports.getAllTransactions = async (req, res) => {
    const transactions = await Transaction.find()
        .populate('user')
        .populate('resourceId')
        .sort({ createdAt: -1 });
    res.render('transaction/index', { transactions });
};
