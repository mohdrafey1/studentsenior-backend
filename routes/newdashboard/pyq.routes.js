const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const {
    getAllPyqs,
    getRequestedPyqs,
    editPyqs,
    deletePyqs,
} = require('../../controllers/newdashboard/pyq.controller.js');
const {
    verifyDashboardUser,
    requireRole,
} = require('../../utils/verifyDashboardUser.js');

router.get('/:collegeName', wrapAsync(getAllPyqs));

router.get('/request-pyq/:collegeName', wrapAsync(getRequestedPyqs));

router
    .route('/:id')
    .put(
        verifyDashboardUser,
        requireRole(['Admin', 'Moderator']),
        wrapAsync(editPyqs)
    )
    .delete(
        verifyDashboardUser,
        requireRole(['Admin', 'Moderator']),
        wrapAsync(deletePyqs)
    );

module.exports = router;
