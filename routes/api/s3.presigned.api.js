const express = require('express');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const router = express.Router();
const { verifyToken } = require('../../utils/verifyUser.js');

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

router.post('/presigned-url', verifyToken, async (req, res) => {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
        return res
            .status(400)
            .json({ error: 'File name and type are required.' });
    }

    const bucketName = process.env.S3_BUCKET_NAME;
    const key = fileName;

    try {
        const params = {
            Bucket: bucketName,
            Key: key,
            ContentType: fileType,
        };

        const uploadUrl = await getSignedUrl(s3, new PutObjectCommand(params), {
            expiresIn: 600,
        });

        console.log(uploadUrl);

        res.json({ uploadUrl, key });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not generate pre-signed URL.' });
    }
});

module.exports = router;
