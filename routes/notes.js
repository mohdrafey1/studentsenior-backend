const notesController = require('../controllers/notes.js');
const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, validateNotes } = require('../middleware.js');

router
    .route('/')
    .get(isLoggedIn, wrapAsync(notesController.index))
    .post(isLoggedIn, validateNotes, wrapAsync(notesController.createNotes));

// Show form to add new PYQ
router.get('/new', isLoggedIn, wrapAsync(notesController.createNotesForm));

router
    .route('/:id')
    .put(isLoggedIn, validateNotes, wrapAsync(notesController.editNotes))
    .delete(isLoggedIn, wrapAsync(notesController.deleteNotes));

// Edit - Show form to edit a PYQ
router.get('/:id/edit', isLoggedIn, wrapAsync(notesController.editNotesForm));

module.exports = router;
