const express = require('express');
const {
    otherStats,
} = require('../../../controllers/dashboard/otherStats/otherStats');
const wrapAsync = require('../../../utils/wrapAsync');

const router = express.Router();

router.get('/', wrapAsync(otherStats));

module.exports = router;
