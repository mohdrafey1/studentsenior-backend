const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const {
    getAllSeniors,
} = require('../../controllers/newdashboard/senior.controller.js');

router.get('/:collegeName', wrapAsync(getAllSeniors));

module.exports = router;
