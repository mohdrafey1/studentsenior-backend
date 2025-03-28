const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const {
    getAllOpportunites,
} = require('../../controllers/newdashboard/opportunity.controller.js');

router.get('/:collegeName', wrapAsync(getAllOpportunites));

module.exports = router;
