const express = require('express');
const router = express.Router();
const communityControllers = require('../../controllers/api/community');
const { verifyToken } = require('../../utils/verifyUser');

router.get('/posts', communityControllers.fetchPost);

router.post('/posts', verifyToken, communityControllers.createPost);

router.put('/posts/:id', verifyToken, communityControllers.updatePost);

router.delete('/posts/:id', verifyToken, communityControllers.deletePost);

router.post(
    '/posts/:postId/comments',
    verifyToken,
    communityControllers.createComment
);

router.put(
    '/posts/:postId/comments/:commentId',
    verifyToken,
    communityControllers.updateComment
);

router.delete(
    '/posts/:postId/comments/:commentId',
    verifyToken,
    communityControllers.deleteComment
);

router.post('/posts/:id/like', verifyToken, communityControllers.likePost);

router.post('/posts/:id/unlike', verifyToken, communityControllers.unlikePost);

router.post(
    '/posts/:postId/comments/:commentId/like',
    verifyToken,
    communityControllers.likeComment
);

module.exports = router;
