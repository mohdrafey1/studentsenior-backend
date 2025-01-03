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

router.get('/', validateApiKey, wrapAsync(apiNotesController.fetchNotes));

router.get(
    '/college/:collegeId',
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

module.exports = router;
