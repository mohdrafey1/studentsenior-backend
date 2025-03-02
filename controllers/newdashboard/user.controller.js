const Client = require('../../models/Client');

module.exports.allUsers = async (req, res) => {
    const users = await Client.find({}).sort({ createdAt: -1 });

    res.status(200).json(users);
};
