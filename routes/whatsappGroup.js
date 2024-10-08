const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, validateGroup } = require('../middleware.js');
const authorizeRole = require('../utils/rolePermission.js');

const groupController = require('../controllers/whatsappGroup.js');

router
    .route('/')
    .get(isLoggedIn, wrapAsync(groupController.index))
    .post(
        isLoggedIn,
        authorizeRole('admin'),
        validateGroup,
        wrapAsync(groupController.createGroup)
    );

router.get('/new', isLoggedIn, wrapAsync(groupController.createGroupForm));

router.get(
    '/:id/edit',
    authorizeRole('admin'),
    isLoggedIn,
    wrapAsync(groupController.editGroupForm)
);

router
    .route('/:id')
    .put(
        isLoggedIn,
        authorizeRole('admin'),
        validateGroup,
        wrapAsync(groupController.editGroup)
    )
    .delete(
        isLoggedIn,
        authorizeRole('admin'),
        wrapAsync(groupController.deleteGroup)
    );

module.exports = router;
