const express = require('express');
const router = express.Router();
const {
    getFileSignedUrl,
} = require('../../controllers/api/cloudfrontsignurl.controller');

router.get('/', getFileSignedUrl);

module.exports = router;
