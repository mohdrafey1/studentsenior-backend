const express = require('express');
const router = express.Router();
const communityControllers = require('../../controllers/api/community');
const { verifyToken } = require('../../utils/verifyUser');
const { validateApiKey } = require('../../middleware.js');

router.get('/posts', validateApiKey, communityControllers.fetchPost);

router.post(
    '/posts',
    validateApiKey,
    verifyToken,
    communityControllers.createPost
);

router.put(
    '/posts/:id',
    validateApiKey,
    verifyToken,
    communityControllers.updatePost
);

router.delete(
    '/posts/:id',
    validateApiKey,
    verifyToken,
    communityControllers.deletePost
);

router.post(
    '/posts/:postId/comments',
    validateApiKey,
    verifyToken,
    communityControllers.createComment
);

router.put(
    '/posts/:postId/comments/:commentId',
    validateApiKey,
    verifyToken,
    communityControllers.updateComment
);

router.delete(
    '/posts/:postId/comments/:commentId',
    validateApiKey,
    verifyToken,
    communityControllers.deleteComment
);

router.post(
    '/posts/:id/like',
    validateApiKey,
    verifyToken,
    communityControllers.likePost
);

// router.post('/posts/:id/unlike', verifyToken, communityControllers.unlikePost);

router.post(
    '/posts/:postId/comments/:commentId/like',
    validateApiKey,
    verifyToken,
    communityControllers.likeComment
);

module.exports = router;
