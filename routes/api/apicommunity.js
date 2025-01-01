const express = require('express');
const router = express.Router();
const communityControllers = require('../../controllers/api/community');
const { verifyToken } = require('../../utils/verifyUser');
const { validateApiKey } = require('../../middleware.js');
const wrapAsync = require('../../utils/wrapAsync.js');

router.get('/posts', validateApiKey, wrapAsync(communityControllers.fetchPost));

router.get(
    '/posts/college/:collegeId',
    validateApiKey,
    wrapAsync(communityControllers.fetchPostByCollege)
);

router.get(
    '/posts/:id',
    validateApiKey,
    wrapAsync(communityControllers.fetchPostbyId)
);

router.post(
    '/posts',
    validateApiKey,
    verifyToken,
    wrapAsync(communityControllers.createPost)
);

router.put(
    '/posts/:id',
    validateApiKey,
    verifyToken,
    wrapAsync(communityControllers.updatePost)
);

router.delete(
    '/posts/:id',
    validateApiKey,
    verifyToken,
    wrapAsync(communityControllers.deletePost)
);

router.post(
    '/posts/:postId/comments',
    validateApiKey,
    verifyToken,
    wrapAsync(communityControllers.createComment)
);

router.put(
    '/posts/:postId/comments/:commentId',
    validateApiKey,
    verifyToken,
    wrapAsync(communityControllers.updateComment)
);

router.delete(
    '/posts/:postId/comments/:commentId',
    validateApiKey,
    verifyToken,
    wrapAsync(communityControllers.deleteComment)
);

router.post(
    '/posts/:id/like',
    validateApiKey,
    verifyToken,
    wrapAsync(communityControllers.likePost)
);

// router.post('/posts/:id/unlike', verifyToken, communityControllers.unlikePost);

router.post(
    '/posts/:postId/comments/:commentId/like',
    validateApiKey,
    verifyToken,
    wrapAsync(communityControllers.likeComment)
);

module.exports = router;
