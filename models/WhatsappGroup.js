const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WhatsappGroupSchema = new Schema(
    {
        title: { type: String, required: true },
        link: { type: String, required: true },
        info: { type: String, required: true },
        domain: { type: String, required: true },
        status: { type: Boolean, default: false },
        college: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'College',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('WhatsappGroup', WhatsappGroupSchema);
