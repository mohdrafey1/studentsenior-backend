const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const {
    getAllPyqs,
} = require('../../controllers/newdashboard/pyq.controller.js');

router.get('/:collegeName', wrapAsync(getAllPyqs));

module.exports = router;
