const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const { validateApiKey, validateNotes } = require('../../middleware.js');

const apiNotesController = require('../../controllers/api/notes.controller.js');

router.get('/', validateApiKey, wrapAsync(apiNotesController.fetchNotes));

router.get(
    '/college/:collegeId',
    validateApiKey,
    wrapAsync(apiNotesController.fetchNotesByCollege)
);

// Create a new notes
router.post('/', validateNotes, wrapAsync(apiNotesController.createNotes));

module.exports = router;
