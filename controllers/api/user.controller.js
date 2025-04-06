const Client = require('../../models/Client.js');
const NewPyqs = require('../../models/NewPyqs.js');
const Notes = require('../../models/Notes.js');
const RedemptionRequest = require('../../models/RedemptionRequest.js');
const Store = require('../../models/Store.js');
const Transaction = require('../../models/Transaction.js');
const AddPoint = require('../../models/AddPoint.js');
const { errorHandler } = require('../../utils/error.js');
const bcryptjs = require('bcryptjs');

// update user

module.exports.updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can update only your account!'));
    }

    if (req.body.username) {
        const existingUser = await Client.findOne({
            username: req.body.username,
        });
        if (existingUser && existingUser._id.toString() !== req.params.id) {
            return next(errorHandler(400, 'Username already exists!'));
        }
    }

    if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await Client.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                username: req.body.username,
                email: req.body.email,
                college: req.body.college,
                phone: req.body.phone,
                password: req.body.password,
                profilePicture: req.body.profilePicture,
            },
        },
        { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
};

// delete user ... will implement later

// module.exports.deleteUser = async (req, res, next) => {
//     if (req.user.id !== req.params.id) {
//         return next(errorHandler(401, 'You can delete only your account!'));
//     }
//
//         await Client.findByIdAndDelete(req.params.id);
//         res.status(200).json('User has been deleted...');
//
// };

module.exports.userResources = async (req, res, next) => {
    const user = await Client.findById(req.user.id);
    const transactions = await Transaction.find({ user: req.user.id }).sort({
        createdAt: -1,
    });
    const productsAdded = await Store.find({ owner: req.user.id })
        .populate('college', 'slug')
        .sort({
            createdAt: -1,
        });

    // console.log(productsAdded);

    const pyqAdded = await NewPyqs.find({ owner: req.user.id })
        .populate({
            path: 'subject',
            select: 'subjectCode subjectName semester branch',
            populate: {
                path: 'branch',
                select: 'branchName branchCode course',
                populate: {
                    path: 'course',
                    select: 'courseCode courseName',
                },
            },
        })
        .populate('college', 'slug')
        .sort({
            createdAt: -1,
        });
    const notesAdded = await Notes.find({ owner: req.user.id })
        .populate({
            path: 'subject',
            select: 'subjectCode subjectName semester branch',
            populate: {
                path: 'branch',
                select: 'branchName branchCode course',
                populate: {
                    path: 'course',
                    select: 'courseCode courseName',
                },
            },
        })
        .populate('college', 'slug')
        .sort({
            createdAt: -1,
        });

    res.json({
        rewardPoints: user.rewardPoints,
        rewardBalance: user.rewardBalance,
        rewardRedeemed: user.rewardRedeemed,
        productsAdded,
        pyqAdded,
        notesAdded,
        transactions,
    });
};

module.exports.redeemPoints = async (req, res, next) => {
    const { rewardBalance, upiId } = req.body;
    const owner = req.user.id;

    const user = await Client.findById(owner);

    if (user.rewardBalance < rewardBalance) {
        return next(errorHandler(403, 'Insufficient reward balance'));
    }

    const newRedeemRequest = new RedemptionRequest({
        upiId,
        rewardBalance,
        owner,
    });

    await newRedeemRequest.save();

    await Client.findByIdAndUpdate(owner, {
        $set: { rewardBalance: user.rewardBalance - rewardBalance },
        $inc: { rewardRedeemed: rewardBalance },
    });

    const transaction = new Transaction({
        user: owner,
        type: 'redeem',
        points: rewardBalance,
    });

    await transaction.save();

    res.status(200).json({ message: 'Redemption successful' });
};

module.exports.addPoints = async (req, res, next) => {
    const owner = req.user.id;
    const { points, rupees, transactionId } = req.body;

    // Check for missing fields
    if (!points || !rupees) {
        next(errorHandler(400, 'All fields are required.'));
    }

    // Create new point entry
    const newPoint = new AddPoint({
        owner,
        pointsAdded: points,
        rupees,
        transactionId,
    });

    await newPoint.save();
    res.status(201).json({
        message: 'Points added and will be reflected within 4 hours',
        newPoint,
    });
};

module.exports.leaderboardPage = async (req, res) => {
    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);

    // Get top users of the current month
    const currentLeaderboard = await Transaction.aggregate([
        {
            $match: {
                createdAt: { $gte: currentMonthStart },
                type: 'earn',
            },
        },
        { $group: { _id: '$user', totalPoints: { $sum: '$points' } } },
        { $sort: { totalPoints: -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: 'clients',
                localField: '_id',
                foreignField: '_id',
                as: 'user',
            },
        },
        { $unwind: '$user' },
        {
            $project: {
                _id: 0,
                userId: '$_id',
                totalPoints: 1,
                username: '$user.username',
                profilePicture: '$user.profilePicture',
            },
        },
    ]);

    // Get the winners of the last 3 months
    const previousWinners = await Transaction.aggregate([
        {
            $match: {
                createdAt: { $gte: threeMonthsAgo, $lt: currentMonthStart },
                type: 'earn',
            },
        },
        {
            $group: {
                _id: { user: '$user', month: { $month: '$createdAt' } },
                totalPoints: { $sum: '$points' },
            },
        },
        { $sort: { '_id.month': -1, totalPoints: -1 } },
        {
            $group: {
                _id: '$_id.month',
                winner: { $first: '$_id.user' },
                points: { $first: '$totalPoints' },
            },
        },
        {
            $lookup: {
                from: 'clients',
                localField: 'winner',
                foreignField: '_id',
                as: 'winnerDetails',
            },
        },
        { $unwind: '$winnerDetails' },
        { $sort: { _id: -1 } },
        {
            $project: {
                _id: 0,
                month: '$_id',
                username: '$winnerDetails.username',
                profilePicture: '$winnerDetails.profilePicture',
                points: 1,
            },
        },
    ]);

    res.status(200).json({
        leaderboard: currentLeaderboard,
        previousWinners,
    });
};

exports.getUserSavedAndPurchasedItems = async (req, res, next) => {
    const deepSubjectPopulate = {
        path: 'subject',
        select: 'subjectCode subjectName semester branch',
        populate: {
            path: 'branch',
            select: 'branchName branchCode course',
            populate: {
                path: 'course',
                select: 'courseCode courseName',
            },
        },
    };

    const deepPopulateOptions = [
        {
            path: 'college',
            select: 'name slug',
        },
        deepSubjectPopulate,
    ];

    const client = await Client.findById(req.user.id)
        .populate({
            path: 'savedPYQs.pyqId',
            populate: deepPopulateOptions,
        })
        .populate({
            path: 'purchasedPYQs',
            populate: deepPopulateOptions,
        })
        .populate({
            path: 'savedNotes.noteId',
            populate: deepPopulateOptions,
        })
        .populate({
            path: 'purchasedNotes',
            populate: deepPopulateOptions,
        });

    if (!client) return next(errorHandler(404, 'User not found'));

    res.status(200).json({
        savedPYQs: client.savedPYQs,
        savedNotes: client.savedNotes,
        purchasedPYQs: client.purchasedPYQs,
        purchasedNotes: client.purchasedNotes,
    });
};

// Save a PYQ
exports.savePYQ = async (req, res, next) => {
    const { pyqId } = req.params;

    if (!pyqId) return next(errorHandler(400, 'PYQ ID is required'));

    const client = await Client.findById(req.user.id);
    const alreadySaved = client.savedPYQs.some(
        (item) => item.pyqId.toString() === pyqId
    );
    if (alreadySaved) return next(errorHandler(409, 'PYQ already saved'));

    client.savedPYQs.push({ pyqId });
    await client.save();

    res.status(200).json({ message: 'PYQ saved successfully' });
};

// Unsave a PYQ
exports.unsavePYQ = async (req, res, next) => {
    const { pyqId } = req.params;

    if (!pyqId) return next(errorHandler(400, 'PYQ ID is required'));

    const client = await Client.findById(req.user.id);
    if (!client) return next(errorHandler(404, 'User not found'));

    const beforeLength = client.savedPYQs.length;

    client.savedPYQs = client.savedPYQs.filter(
        (item) => item.pyqId.toString() !== pyqId
    );

    const afterLength = client.savedPYQs.length;

    if (beforeLength === afterLength) {
        return next(errorHandler(404, 'PYQ not found in saved list'));
    }

    await client.save();

    res.status(200).json({ message: 'PYQ unsaved successfully' });
};

// Save a Note
exports.saveNote = async (req, res, next) => {
    const { noteId } = req.params;
    if (!noteId) return next(errorHandler(400, 'Note ID is required'));

    const client = await Client.findById(req.user.id);
    const alreadySaved = client.savedNotes.some(
        (item) => item.noteId.toString() === noteId
    );
    if (alreadySaved) return next(errorHandler(409, 'Note already saved'));

    client.savedNotes.push({ noteId });
    await client.save();

    res.status(200).json({ message: 'Note saved successfully' });
};

// Unsave a Note
exports.unsaveNote = async (req, res, next) => {
    const { noteId } = req.params;

    if (!noteId) return next(errorHandler(400, 'Note ID is required'));

    const client = await Client.findById(req.user.id);
    if (!client) return next(errorHandler(404, 'User not found'));

    const beforeLength = client.savedNotes.length;

    client.savedNotes = client.savedNotes.filter(
        (item) => item.noteId.toString() !== noteId
    );

    const afterLength = client.savedNotes.length;

    if (beforeLength === afterLength) {
        return next(errorHandler(404, 'Note not found in saved list'));
    }

    await client.save();

    res.status(200).json({ message: 'Note unsaved successfully' });
};
