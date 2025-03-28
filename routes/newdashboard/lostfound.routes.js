const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const {
    getAllLostFoundItems,
} = require('../../controllers/newdashboard/lostandfound.controller.js');

router.get('/:collegeName', wrapAsync(getAllLostFoundItems));

module.exports = router;
