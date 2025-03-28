const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const {
    getAllPost,
} = require('../../controllers/newdashboard/community.controller.js');

router.get('/:collegeName', wrapAsync(getAllPost));

module.exports = router;
