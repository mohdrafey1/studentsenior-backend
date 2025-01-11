const pyqController = require('../../controllers/dashboard/newPyq.controller.js');
const authorizeRole = require('../../utils/rolePermission.js');
const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync');
const { isLoggedIn } = require('../../middleware.js');

router.route('/').get(isLoggedIn, wrapAsync(pyqController.index));

router
    .route('/:id')
    .put(isLoggedIn, authorizeRole('admin'), wrapAsync(pyqController.editPyqs))
    .delete(
        isLoggedIn,
        authorizeRole('admin'),
        wrapAsync(pyqController.deletePyqs)
    );

// Edit - Show form to edit a PYQ
router.get('/:id/edit', isLoggedIn, wrapAsync(pyqController.editPyqsForm));

module.exports = router;
