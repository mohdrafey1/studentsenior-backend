const ContactUs = require('../../models/ContactUs');

module.exports.createContactus = async (req, res) => {
    const { email, subject, description } = req.body;

    const message = new ContactUs({
        email,
        subject,
        description,
    });

    message.save();
    res.status(201).json({
        message: 'Message Send Successfully',
    });
};
