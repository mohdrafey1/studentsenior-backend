const express = require('express');
const router = express.Router();
const Colleges = require('../models/Colleges.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateColleges } = require('../middleware.js');

const collegeController = require('../controllers/college.js');

router
    .route('/')
    .get(wrapAsync(collegeController.index))
    .post(
        isLoggedIn,
        validateColleges,
        wrapAsync(collegeController.createCollege)
    );

//new
router.get('/new', isLoggedIn, collegeController.collegeForm);

router
    .route('/:id')
    .get(wrapAsync(collegeController.showCollege))
    .put(
        isLoggedIn,
        isOwner,
        validateColleges,
        wrapAsync(collegeController.editCollege)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(collegeController.deleteCollege));

//edit
router.get(
    '/:id/edit',
    isLoggedIn,
    isOwner,
    wrapAsync(collegeController.editCollegeForm)
);

module.exports = router;
