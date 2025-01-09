const contactUs = require('../../models/ContactUs');
const express = require('express');
const wrapAsync = require('../../utils/wrapAsync');
const router = express.Router();

router.get(
    '/',
    wrapAsync(async (req, res) => {
        const messages = await contactUs.find({});
        res.render('contactus/messages.ejs', { messages });
    })
);

router.delete(
    '/:id',
    wrapAsync(async (req, res) => {
        await contactUs.findByIdAndDelete(req.params.id);
        res.redirect(`/contactus`);
    })
);

module.exports = router;
