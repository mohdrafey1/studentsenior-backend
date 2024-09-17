const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const { validateColleges } = require('../../middleware.js');

const apiCollegeController = require('../../controllers/api/college.js');

router.get('/', apiCollegeController.fetchCollege);

router.post(
    '/',
    validateColleges,
    wrapAsync(apiCollegeController.createCollege)
);

module.exports = router;
