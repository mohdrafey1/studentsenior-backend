const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: {
            type: String,
            match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
        },
        college: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
