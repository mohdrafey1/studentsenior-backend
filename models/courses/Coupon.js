const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
    },
    minPurchase: {
        type: Number,
        default: 0, // Minimum amount required for coupon to be valid
    },
    maxDiscount: {
        type: Number,
        default: null, // Maximum discount allowed for percentage-based coupons
    },
    usageLimit: {
        type: Number,
        default: 1, // How many times this coupon can be used
    },
    usedCount: {
        type: Number,
        default: 0,
    },
    validFrom: {
        type: Date,
        required: true,
    },
    validTo: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

module.exports = mongoose.model('Coupon', CouponSchema);
