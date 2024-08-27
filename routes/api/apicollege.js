const express = require('express');
const router = express.Router();
const Colleges = require('../../models/Colleges.js');
const wrapAsync = require('../../utils/wrapAsync.js');

const apiCollegeController = require('../../controllers/api/college.js');

// Fetch all colleges and send as JSON
router.get('/', apiCollegeController.fetchCollege);

// Create a new college
router.post('/', wrapAsync(apiCollegeController.createCollege));

module.exports = router;
