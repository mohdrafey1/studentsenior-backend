const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');

const apiNotesController = require('../../controllers/api/notes.js');

// Fetch all NOtes and send as JSON
router.get('/', apiNotesController.fetchNotes);

// Create a new notes
router.post('/', wrapAsync(apiNotesController.createNotes));

module.exports = router;
