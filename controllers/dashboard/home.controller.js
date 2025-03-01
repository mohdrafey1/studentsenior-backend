const User = require('../../models/User');
const Client = require('../../models/Client');
const Senior = require('../../models/Senior.js');
const Store = require('../../models/Store.js');
const PYQ = require('../../models/PYQ');
const Colleges = require('../../models/Colleges');
const Groups = require('../../models/WhatsappGroup');
const Notes = require('../../models/Notes');
const Post = require('../../models/Post.js');
const { GetOpportunity, GiveOpportunity } = require('../../models/Opportunity');
const ContactUs = require('../../models/ContactUs.js');
const PyqRequest = require('../../models/PyqRequest.js');
const NewPyqs = require('../../models/NewPyqs.js');
const LostFound = require('../../models/LostFound.js');
const AddPoint = require('../../models/AddPoint.js');

module.exports.home = async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalClients = await Client.countDocuments();
    const totalPYQs = await PYQ.countDocuments();
    const totalColleges = await Colleges.countDocuments();
    const totalGroups = await Groups.countDocuments();
    const totalNotes = await Notes.countDocuments();
    const totalSeniors = await Senior.countDocuments();
    const totalProduct = await Store.countDocuments();
    const totalPost = await Post.countDocuments();
    const totalGetCommunity = await GetOpportunity.countDocuments();
    const totalGiveCommunity = await GiveOpportunity.countDocuments();
    const totalMessages = await ContactUs.countDocuments();
    const totalRequestedPyqs = await PyqRequest.countDocuments();
    const totalNewPyqs = await NewPyqs.countDocuments();
    const totalLostFound = await LostFound.countDocuments();
    const totalAddPointsRequest = await AddPoint.countDocuments();

    // Fetch recent 5 entries for each category
    const recentPYQs = await NewPyqs.find({ status: false })
        .populate('subject')
        .sort({ createdAt: 1 })
        .limit(5);
    const recentSeniors = await Senior.find().sort({ createdAt: -1 }).limit(5);
    const recentProducts = await Store.find().sort({ createdAt: -1 }).limit(5);
    const recentColleges = await Colleges.find()
        .sort({ createdAt: -1 })
        .limit(5);
    const recentNotes = await Notes.find().sort({ createdAt: -1 }).limit(5);
    const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(5);
    const recentGroups = await Groups.find().sort({ createdAt: -1 }).limit(5);
    const recentGetOpportunity = await GetOpportunity.find()
        .sort({ createdAt: -1 })
        .limit(5);
    const recentGiveOpportunity = await GiveOpportunity.find()
        .sort({ createdAt: -1 })
        .limit(5);

    res.render('index', {
        totalUsers,
        totalClients,
        totalPYQs,
        totalColleges,
        totalGroups,
        totalNotes,
        totalSeniors,
        totalProduct,
        totalPost,
        totalGetCommunity,
        totalGiveCommunity,
        totalMessages,
        totalRequestedPyqs,
        totalNewPyqs,
        totalLostFound,
        totalAddPointsRequest,
        recentPYQs,
        recentSeniors,
        recentProducts,
        recentColleges,
        recentNotes,
        recentGroups,
        recentPosts,
        recentGetOpportunity,
        recentGiveOpportunity,
    });
};

module.exports.user = async (req, res) => {
    let allUsers = await User.find({});
    res.render('home/user.ejs', { allUsers });
};

module.exports.client = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const username = req.query.username || '';
    const minRewardPoints = parseInt(req.query.minRewardPoints) || 0;

    const startIndex = (page - 1) * limit;

    const filter = {};
    if (username) {
        filter.username = new RegExp(username, 'i');
    }
    if (minRewardPoints) {
        filter.rewardPoints = { $gte: minRewardPoints };
    }

    const totalClients = await Client.countDocuments(filter);

    const allClient = await Client.find(filter)
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit);

    const totalPages = Math.ceil(totalClients / limit);

    const filterParams = `&username=${username}&minRewardPoints=${minRewardPoints}`;

    res.render('home/client.ejs', {
        allClient,
        currentPage: page,
        totalPages,
        limit,
        username,
        minRewardPoints,
        filterParams,
    });
};
