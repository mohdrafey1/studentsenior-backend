const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const { verifyToken } = require('../../utils/verifyUser');
const { validateColleges, validateApiKey } = require('../../middleware.js');

const apiCollegeController = require('../../controllers/api/college.controller.js');

router.get('/', validateApiKey, wrapAsync(apiCollegeController.fetchCollege));

router.get(
    '/:collegeId',
    validateApiKey,
    wrapAsync(apiCollegeController.fetchCollegeById)
);

router.post(
    '/',
    verifyToken,
    validateColleges,
    wrapAsync(apiCollegeController.createCollege)
);

module.exports = router;
