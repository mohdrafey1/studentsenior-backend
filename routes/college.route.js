const express = require('express');
const router = express.Router();
const authorizeRole = require('../utils/rolePermission.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateColleges } = require('../middleware.js');

const collegeController = require('../controllers/college.controller.js');

router
    .route('/')
    .get(isLoggedIn, wrapAsync(collegeController.index))
    .post(
        isLoggedIn,
        authorizeRole('admin'),
        validateColleges,
        wrapAsync(collegeController.createCollege)
    );

//new
router.get('/new', isLoggedIn, wrapAsync(collegeController.collegeForm));

router
    .route('/:id')
    .get(wrapAsync(collegeController.showCollege))
    .put(
        isLoggedIn,
        authorizeRole('admin'),
        isOwner,
        validateColleges,
        wrapAsync(collegeController.editCollege)
    )
    .delete(isLoggedIn, isOwner, wrapAsync(collegeController.deleteCollege));

//edit
router.get(
    '/:id/edit',
    isLoggedIn,
    authorizeRole('admin'),
    isOwner,
    wrapAsync(collegeController.editCollegeForm)
);

module.exports = router;
