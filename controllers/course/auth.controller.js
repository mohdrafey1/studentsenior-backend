const Client = require('../../models/Client');

module.exports.getUserDetail = async (req, res) => {
    const userId = req.user.id;
    const user = await Client.findOne({ _id: userId }).select('username email');

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
};
