const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        isAnonymous: {
            type: Boolean,
            default: false,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client',
            required: true,
        },
        college: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'College',
            required: true,
        },
        likes: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Client',
            default: [],
        },
        comments: [
            {
                content: {
                    type: String,
                    required: true,
                },
                author: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Client',
                    required: true,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
                likes: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        clickCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
