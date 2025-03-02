const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');

const {
    getCourses,
    getBranches,
    getSubjects,
} = require('../../controllers/newdashboard/resource.controller.js');

router.get('/courses', wrapAsync(getCourses));

router.get('/branches', wrapAsync(getBranches));

router.get('/subjects', wrapAsync(getSubjects));

module.exports = router;
