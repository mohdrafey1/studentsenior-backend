const User = require('../models/User');
const Client = require('../models/Client');
const Senior = require('../models/Senior.js');
const Store = require('../models/Store.js');
const PYQ = require('../models/PYQ');
const Colleges = require('../models/Colleges');
const Groups = require('../models/WhatsappGroup');
const Notes = require('../models/Notes');
const Post = require('../models/Post.js');

module.exports.home = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalClients = await Client.countDocuments();
        const totalPYQs = await PYQ.countDocuments();
        const totalColleges = await Colleges.countDocuments();
        const totalGroups = await Groups.countDocuments();
        const totalNotes = await Notes.countDocuments();
        const totalSeniors = await Senior.countDocuments();
        const totalProduct = await Store.countDocuments();
        const totalPost = await Post.countDocuments();

        // Fetch recent 5 entries for each category
        const recentPYQs = await PYQ.find().sort({ createdAt: -1 }).limit(5);
        const recentSeniors = await Senior.find()
            .sort({ createdAt: -1 })
            .limit(5);
        const recentProducts = await Store.find()
            .sort({ createdAt: -1 })
            .limit(5);
        const recentColleges = await Colleges.find()
            .sort({ createdAt: -1 })
            .limit(5);
        const recentNotes = await Notes.find().sort({ createdAt: -1 }).limit(5);
        const recentPosts = await Post.find().sort({ createdAt: -1 }).limit(5);
        const recentGroups = await Groups.find()
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
            recentPYQs,
            recentSeniors,
            recentProducts,
            recentColleges,
            recentNotes,
            recentGroups,
            recentPosts,
        });
    } catch (error) {
        console.error('Error fetching totals and recent items:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports.user = async (req, res) => {
    let allUsers = await User.find({});
    res.render('home/user.ejs', { allUsers });
};

module.exports.client = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;

    const startIndex = (page - 1) * limit;

    try {
        const totalClients = await Client.countDocuments();

        const allClient = await Client.find({})
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        const totalPages = Math.ceil(totalClients / limit);

        res.render('home/client.ejs', {
            allClient,
            currentPage: page,
            totalPages,
        });
    } catch (error) {
        res.status(500).send('Error fetching clients');
    }
};
