const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const {
    getAllNotes,
    editNotes,
    deleteNotes,
} = require('../../controllers/newdashboard/notes.controller.js');
const {
    verifyDashboardUser,
    requireRole,
} = require('../../utils/verifyDashboardUser.js');

router.get('/:collegeName', wrapAsync(getAllNotes));

router
    .route('/:id')
    .put(
        verifyDashboardUser,
        requireRole(['Admin', 'Moderator']),
        wrapAsync(editNotes)
    )
    .delete(
        verifyDashboardUser,
        requireRole(['Admin', 'Moderator']),
        wrapAsync(deleteNotes)
    );

module.exports = router;
