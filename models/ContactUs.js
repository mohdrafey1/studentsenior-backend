const mongoose = require('mongoose');

const contactusSchema = mongoose.Schema(
    {
        email: { type: String, required: true },
        subject: { type: String, required: true },
        description: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('ContactUs', contactusSchema);
