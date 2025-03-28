const Client = require('../../models/Client');
const DashboardUser = require('../../models/DashboardUser');

module.exports.allUsers = async (req, res) => {
    const users = await Client.find({}).sort({ createdAt: -1 });

    res.status(200).json(users);
};

module.exports.allDashboardUser = async (req, res) => {
    const dashboardUser = await DashboardUser.find({}).sort({ createdAt: -1 });

    res.status(200).json(dashboardUser);
};
