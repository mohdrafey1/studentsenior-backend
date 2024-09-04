const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');

const apiCollegeController = require('../../controllers/api/college.js');

router.get('/', apiCollegeController.fetchCollege);

router.post('/', wrapAsync(apiCollegeController.createCollege));

module.exports = router;
