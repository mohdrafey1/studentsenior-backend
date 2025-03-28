const crypto = require('crypto');
const phonepeConfig = require('../config/phonepe');

const generateBase64Payload = (payload) => {
    return Buffer.from(JSON.stringify(payload)).toString('base64');
};

const generateChecksum = (base64Payload, endpoint) => {
    const string = base64Payload + endpoint + phonepeConfig.saltKey;
    const hash = crypto.createHash('sha256').update(string).digest('hex');
    return hash + '###' + phonepeConfig.saltIndex;
};

const createPaymentPayload = (amount, merchantTransactionId, userId) => ({
    merchantId: `${phonepeConfig.merchantId}`,
    merchantTransactionId: merchantTransactionId,
    merchantUserId: userId,
    amount: amount * 100,
    redirectUrl: `${phonepeConfig.redirectUrl}/${merchantTransactionId}`,
    callbackUrl: `${phonepeConfig.redirectUrl}/${merchantTransactionId}`,
    redirectMode: 'REDIRECT',
    paymentInstrument: {
        type: 'PAY_PAGE',
    },
});

module.exports = {
    generateBase64Payload,
    generateChecksum,
    createPaymentPayload,
};
