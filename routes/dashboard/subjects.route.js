const express = require('express');
const router = express.Router();
const authorizeRole = require('../../utils/rolePermission.js');
const wrapAsync = require('../../utils/wrapAsync.js');
const { isLoggedIn } = require('../../middleware.js');

const {
    getSubjects,
    addSubject,
    addSubjectForm,
    editSubject,
    editSubjectForm,
    deleteSubject,
} = require('../../controllers/dashboard/subject.controller.js');

router
    .route('/')
    .get(isLoggedIn, wrapAsync(getSubjects))
    .post(isLoggedIn, authorizeRole('admin'), wrapAsync(addSubject));

router.get('/new', isLoggedIn, wrapAsync(addSubjectForm));

router.get(
    '/:id/edit',
    isLoggedIn,
    authorizeRole('admin'),
    wrapAsync(editSubjectForm)
);

router
    .route('/:id')
    .put(isLoggedIn, authorizeRole('admin'), wrapAsync(editSubject))
    .delete(isLoggedIn, authorizeRole('admin'), wrapAsync(deleteSubject));

module.exports = router;
