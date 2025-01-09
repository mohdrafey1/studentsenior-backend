const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const { validateApiKey } = require('../../middleware.js');

const {
    getCourses,
    getBranches,
    getSubjects,
} = require('../../controllers/api/resource.controller.js');

router.get('/courses', validateApiKey, wrapAsync(getCourses));

router.get('/branches/:course', validateApiKey, wrapAsync(getBranches));

router.get('/subjects/:branch', validateApiKey, wrapAsync(getSubjects));

module.exports = router;
