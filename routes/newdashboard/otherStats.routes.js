const express = require('express');
const {
    otherStats,
} = require('../../controllers/newdashboard/otherStats.controller');
const wrapAsync = require('../../utils/wrapAsync');

const router = express.Router();

router.get('/', wrapAsync(otherStats));

module.exports = router;
