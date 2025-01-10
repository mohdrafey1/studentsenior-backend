const express = require('express');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const router = express.Router();
const { verifyToken } = require('../../utils/verifyUser.js');
const wrapAsync = require('../../utils/wrapAsync.js');
const { errorHandler } = require('../../utils/error.js');

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

router.post(
    '/presigned-url',
    verifyToken,
    wrapAsync(async (req, res, next) => {
        const { fileName, fileType } = req.body;

        if (!fileName || !fileType) {
            return next(errorHandler(400, 'File name and type are required.'));
        }

        const bucketName = process.env.S3_BUCKET_NAME;
        const key = fileName;

        const params = {
            Bucket: bucketName,
            Key: key,
            ContentType: fileType,
        };

        const uploadUrl = await getSignedUrl(s3, new PutObjectCommand(params), {
            expiresIn: 600,
        });

        res.json({ uploadUrl, key });
    })
);

module.exports = router;
