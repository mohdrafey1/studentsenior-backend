const Client = require('../../models/Client.js');
const { errorHandler } = require('../../utils/error.js');
const bcryptjs = require('bcryptjs');

// update user

module.exports.updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can update only your account!'));
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
