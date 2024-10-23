const contactUs = require('../models/ContactUs');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const messages = await contactUs.find({});
        res.render('contactus/messages.ejs', { messages });
    } catch (error) {
        console.log(error);
        req.flash('error', 'Error Fetching Messages');
    }
});

module.exports = router;
