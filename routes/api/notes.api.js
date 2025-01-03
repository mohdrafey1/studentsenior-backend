const express = require('express');
const multer = require('multer');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const { validateApiKey, validateNotes } = require('../../middleware.js');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 },
});

const apiNotesController = require('../../controllers/api/notes.controller.js');

router.get(
    '/:subjectId/:collegeId',
    validateApiKey,
    wrapAsync(apiNotesController.fetchNotesByCollege)
);

// Create a new notes
router.post(
    '/',
    upload.single('file'),
    // validateNotes,
    wrapAsync(apiNotesController.createNotes)
);

router.delete('/:id', validateApiKey, wrapAsync(apiNotesController.deleteNote));

module.exports = router;
