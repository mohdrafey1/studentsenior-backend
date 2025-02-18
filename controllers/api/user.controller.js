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
    if (!points || !rupees || !transactionId) {
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
