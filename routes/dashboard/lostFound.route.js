const lostFoundController = require('../../controllers/dashboard/lostFound.controller.js');
const authorizeRole = require('../../utils/rolePermission.js');
const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync');
const { isLoggedIn, validateNotes } = require('../../middleware.js');

router
    .route('/')
    .get(isLoggedIn, wrapAsync(lostFoundController.getLostFoundItems));

router
    .route('/:id')
    .put(
        isLoggedIn,
        authorizeRole('admin'),
        wrapAsync(lostFoundController.editLostFoundItem)
    )
    .delete(
        isLoggedIn,
        authorizeRole('admin'),
        wrapAsync(lostFoundController.deleteLostFoundItem)
    );

// Edit - Show form to edit a PYQ
router.get(
    '/:id/edit',
    isLoggedIn,
    authorizeRole('admin'),
    wrapAsync(lostFoundController.editLostFoundForm)
);

module.exports = router;
