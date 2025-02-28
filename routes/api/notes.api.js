const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const { validateApiKey } = require('../../middleware.js');
const { verifyToken } = require('../../utils/verifyUser.js');

const apiNotesController = require('../../controllers/api/notes.controller.js');

router.get(
    '/college/:collegeId',
    validateApiKey,
    wrapAsync(apiNotesController.fetchAllNotes)
);

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

router.get(
    '/:slug',
    validateApiKey,
    verifyToken,
    wrapAsync(apiNotesController.getNote)
);

router.post(
    '/purchase/:id',
    verifyToken,
    wrapAsync(apiNotesController.purchaseNote)
);

router.put('/:id', verifyToken, wrapAsync(apiNotesController.editNote));
module.exports = router;
