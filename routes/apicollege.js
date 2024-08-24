const express = require('express');
const router = express.Router();
const Colleges = require('../models/Colleges.js');
const wrapAsync = require('../utils/wrapAsync.js');

// Fetch all colleges and send as JSON
router.get('/', async (req, res) => {
    try {
        const allColleges = await Colleges.find({ status: true });
        res.json(allColleges);
    } catch (err) {
        console.error('Error fetching colleges:', err);
        res.json({ description: 'Error fetching colleges' });
    }
});

// Create a new college
router.post(
    '/',
    wrapAsync(async (req, res) => {
        const { name, location, description } = req.body;
        const newCollege = new Colleges({
            name,
            location,
            description,
        });
        await newCollege.save();
        res.json({
            description:
                'College submitted successfully and is pending approval.',
        });
    })
);

module.exports = router;
