const notesController = require('../controllers/notes.js');
const authorizeRole = require('../utils/rolePermission.js');
const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, validateNotes } = require('../middleware.js');

router
    .route('/')
    .get(isLoggedIn, wrapAsync(notesController.index))
    .post(
        isLoggedIn,
        authorizeRole('admin'),
        validateNotes,
        wrapAsync(notesController.createNotes)
    );

// Show form to add new PYQ
router.get(
    '/new',
    // authorizeRole('admin'),
    isLoggedIn,
    wrapAsync(notesController.createNotesForm)
);

router
    .route('/:id')
    .put(
        isLoggedIn,
        validateNotes,
        authorizeRole('admin'),
        wrapAsync(notesController.editNotes)
    )
    .delete(
        isLoggedIn,
        authorizeRole('admin'),
        wrapAsync(notesController.deleteNotes)
    );

// Edit - Show form to edit a PYQ
router.get(
    '/:id/edit',
    isLoggedIn,
    authorizeRole('admin'),
    wrapAsync(notesController.editNotesForm)
);

module.exports = router;
