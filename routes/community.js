const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn } = require('../middleware');
const communityController = require('../controllers/community');

router.get('/', isLoggedIn, wrapAsync(communityController.fetchPost));

router.get('/:id', isLoggedIn, wrapAsync(communityController.showPost));

router.delete('/:id', isLoggedIn, wrapAsync(communityController.deletePost));

router.get(
    '/:id/edit',
    isLoggedIn,
    wrapAsync(communityController.editPostForm)
);

router.put('/:id', isLoggedIn, wrapAsync(communityController.editPost));

router.delete(
    '/community/:postId/comments/:commentId',
    communityController.deleteComment
);

module.exports = router;
