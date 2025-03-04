const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const {
    getAllGroups,
} = require('../../controllers/newdashboard/group.controller.js');

router.get('/:collegeName', wrapAsync(getAllGroups));

module.exports = router;
