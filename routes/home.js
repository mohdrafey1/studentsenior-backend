const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Client = require('../models/Client');
const PYQ = require('../models/PYQ');
const College = require('../models/Colleges');
const Group = require('../models/WhatsappGroup');
const Note = require('../models/Notes');
const { isLoggedIn, isRafey } = require('../middleware.js');
const Senior = require('../models/Senior.js');

router.get('/', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalClients = await Client.countDocuments();
        const totalPYQs = await PYQ.countDocuments();
        const totalColleges = await College.countDocuments();
        const totalGroups = await Group.countDocuments();
        const totalNotes = await Note.countDocuments();
        const totalSeniors = await Senior.countDocuments();

        res.render('index', {
            totalUsers,
            totalClients,
            totalPYQs,
            totalColleges,
            totalGroups,
            totalNotes,
            totalSeniors,
        });
    } catch (error) {
        console.error('Error fetching totals:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/user', isRafey, async (req, res) => {
    let allUsers = await User.find({});
    res.render('home/user.ejs', { allUsers });
});

router.get('/client', isRafey, async (req, res) => {
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
});

module.exports = router;
