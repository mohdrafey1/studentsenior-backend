const express = require('express');
const multer = require('multer');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const { validateApiKey } = require('../../middleware.js');
const { verifyToken } = require('../../utils/verifyUser.js');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
});

const apiNotesController = require('../../controllers/api/notes.controller.js');

router.get(
    '/:branchCode/:subjectCode/:collegeId',
    validateApiKey,
    wrapAsync(apiNotesController.fetchNotesByCollege)
);

// Create a new notes
router.post(
    '/',
    upload.single('file'),
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

module.exports = router;
