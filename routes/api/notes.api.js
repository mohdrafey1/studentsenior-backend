const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const { validateApiKey } = require('../../middleware.js');
const { verifyToken } = require('../../utils/verifyUser.js');

const apiNotesController = require('../../controllers/api/notes.controller.js');

router.get(
    '/:branchCode/:subjectCode/:collegeId',
    validateApiKey,
    wrapAsync(apiNotesController.fetchNotesByCollege)
);

// Create a new notes
router.post(
    '/',
    verifyToken,
    // validateNotes,
    wrapAsync(apiNotesController.createNotes)
);

router.delete(
    '/:id',
    verifyToken,
    validateApiKey,
    wrapAsync(apiNotesController.deleteNote)
);

router.post(
    '/:id/like',
    validateApiKey,
    verifyToken,
    wrapAsync(apiNotesController.likeNote)
);

router.get('/:slug', validateApiKey, wrapAsync(apiNotesController.getNote));

module.exports = router;
