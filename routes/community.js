const express = require('express');
const router = express.Router();
const authorizeRole = require('../utils/rolePermission.js');
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn } = require('../middleware');
const communityController = require('../controllers/community');

router.get('/', isLoggedIn, wrapAsync(communityController.fetchPost));

router.get('/:id', isLoggedIn, wrapAsync(communityController.showPost));

router.delete(
    '/:id',
    isLoggedIn,
    authorizeRole('admin'),
    wrapAsync(communityController.deletePost)
);

router.get(
    '/:id/edit',
    isLoggedIn,
    authorizeRole('admin'),
    wrapAsync(communityController.editPostForm)
);

router.put(
    '/:id',
    isLoggedIn,
    authorizeRole('admin'),
    wrapAsync(communityController.editPost)
);

router.delete(
    '/community/:postId/comments/:commentId',
    isLoggedIn,
    authorizeRole('admin'),
    wrapAsync(communityController.deleteComment)
);

module.exports = router;
