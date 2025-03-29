module.exports = {
    env: process.env.NODE_ENV === 'production' ? 'PROD' : 'UAT',

    credentials: {
        clientId: process.env.PHONEPE_CLIENT_ID,
        clientSecret: process.env.PHONEPE_CLIENT_SECRET,
        clientVersion: process.env.PHONEPE_CLIENT_VERSION || '1',
    },

    endpoints: {
        UAT: {
            auth: 'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token',
            payment:
                'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay',
            status: 'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order',
        },
        PROD: {
            auth: 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token',
            payment: 'https://api.phonepe.com/apis/pg/checkout/v2/pay',
            status: 'https://api.phonepe.com/apis/pg/checkout/v2/order',
        },
    },

    urls: {
        backend: process.env.BACKEND_URL,
        frontend: process.env.FRONTEND_BASE_URL,
    },
};
