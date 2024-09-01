const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, validateGroup } = require('../middleware.js');

const groupController = require('../controllers/whatsappGroup.js');

router
    .route('/')
    .get(isLoggedIn, wrapAsync(groupController.index))
    .post(isLoggedIn, validateGroup, wrapAsync(groupController.createGroup));

router.get('/new', isLoggedIn, wrapAsync(groupController.createGroupForm));

router.get('/:id/edit', isLoggedIn, wrapAsync(groupController.editGroupForm));

router
    .route('/:id')
    .put(isLoggedIn, validateGroup, wrapAsync(groupController.editGroup))
    .delete(isLoggedIn, wrapAsync(groupController.deleteGroup));

module.exports = router;
