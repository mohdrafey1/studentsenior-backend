const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const {
    getAllNotes,
} = require('../../controllers/newdashboard/notes.controller.js');

router.get('/:collegeName', wrapAsync(getAllNotes));

module.exports = router;
