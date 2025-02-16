const { getSignedUrl } = require('@aws-sdk/cloudfront-signer');

// Decode base64 private key
const privateKey = Buffer.from(
    process.env.CLOUDFRONT_PRIVATE_KEY,
    'base64'
).toString('utf-8');
const keyPairId = process.env.CLOUDFRONT_KEY_PAIR_ID;

const fetchSignedUrl = (s3Url) => {
    const url = s3Url.replace(
        'https://studentsenior.s3.ap-south-1.amazonaws.com/',
        `${process.env.CLOUDFRONT_URL}/`
    );

    const expires = Math.floor(Date.now() / 1000) + 60 * 0.25; // 15 sec expiration

    // Generate the signed URL using AWS SDK
    const signedUrl = getSignedUrl({
        url,
        keyPairId,
        privateKey,
        dateLessThan: new Date(expires * 1000).toISOString(),
    });

    return signedUrl;
};

// Express route to get signed URL
const getFileSignedUrl = (req, res) => {
    try {
        const { fileUrl } = req.query;
        if (!fileUrl) {
            return res.status(400).json({ message: 'File URL is required' });
        }

        const signedUrl = fetchSignedUrl(fileUrl);
        res.json({ signedUrl });
    } catch (error) {
        console.error('Error generating signed URL:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getFileSignedUrl };
