const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const { verifyToken } = require('../../utils/verifyUser');
const { validateColleges, validateApiKey } = require('../../middleware.js');

const apiCollegeController = require('../../controllers/api/college.js');

router.get('/', validateApiKey, apiCollegeController.fetchCollege);

router.post(
    '/',
    verifyToken,
    validateColleges,
    wrapAsync(apiCollegeController.createCollege)
);

module.exports = router;
