const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const {
    getAllPyqs,
    getRequestedPyqs,
} = require('../../controllers/newdashboard/pyq.controller.js');

router.get('/:collegeName', wrapAsync(getAllPyqs));

router.get('/request-pyq/:collegeName', wrapAsync(getRequestedPyqs));

module.exports = router;
