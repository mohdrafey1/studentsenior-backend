const Post = require('../../models/Post');
const { errorHandler } = require('../../utils/error');

module.exports.fetchPost = async (req, res) => {
    const posts = await Post.find()
        .populate('college')
        .populate('author', 'username profilePicture')
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
            },
        });
    res.json(posts);
};

module.exports.fetchPostByCollege = async (req, res) => {
    const { collegeId } = req.params;
    const posts = await Post.find({ college: collegeId })
        .sort({
            createdAt: -1,
        })
        .populate('college', 'name')
        .populate('author', 'username profilePicture')
        .populate({
            path: 'comments',
            select: 'content createdAt',
            populate: {
                path: 'author',
                select: 'username profilePicture',
            },
        });

    res.status(200).json(posts);
};

module.exports.fetchPostbyId = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id)
        .populate('college')
        .populate('author')
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
            },
        });
    if (!post) {
        return next(errorHandler(404, 'Post not found'));
    }
    await Post.findByIdAndUpdate(id, { $inc: { clickCount: 1 } });

    res.status(200).json(post);
};

module.exports.createPost = async (req, res, next) => {
    const { content, isAnonymous, college } = req.body;
    let author = req.user.id;

    const newPost = new Post({ content, isAnonymous, college, author });
    await newPost.save();
    res.json({ message: 'Post Created Succesfully' });
};

module.exports.updatePost = async (req, res) => {
    const { content, isAnonymous, college } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(errorHandler(404, 'Post Not Found '));
    }

    const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
            content,
            isAnonymous,
            college,
        },
        { new: true }
    );

    res.json({ message: 'Post Updated Succesfully ', updatedPost });
};

module.exports.deletePost = async (req, res) => {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
        return next(errorHandler(404, 'Post not found'));
    }

    await Post.findByIdAndDelete(postId);
    res.json({ message: 'Post Deleted Successfully' });
};

module.exports.createComment = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
        return next(errorHandler(404, 'Post not found'));
    }

    const author = userId;

    const newComment = {
        content,
        author,
        timestamp: new Date(),
        likes: 0,
    };

    post.comments.push(newComment);
    await post.save();

    res.json({ message: 'Commented Successfully' });
};

module.exports.updateComment = async (req, res) => {
    const { postId, commentId } = req.params;

    const { content } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
        return next(errorHandler(404, 'Post not found'));
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
        return next(errorHandler(404, 'Comment not found'));
    }

    comment.content = content;
    await post.save();

    res.json({ message: 'comment updated successfully' });
};

module.exports.deleteComment = async (req, res) => {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
        return next(errorHandler(404, 'Post not found'));
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
        return next(errorHandler(404, 'Comment not found'));
    }

    post.comments.pull({ _id: commentId });
    await post.save();

    return res.json({ message: 'Comment deleted successfully' });
};

module.exports.likePost = async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
        return next(errorHandler(404, 'Post not found'));
    }

    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
        post.likes = post.likes.filter(
            (id) => id.toString() !== userId.toString()
        );
        await post.save();
        return res.json({
            message: 'Post unliked!',
            likes: post.likes.length,
        });
    } else {
        post.likes.push(userId);
        await post.save();
        return res.json({
            message: 'Post liked!',
            likes: post.likes.length,
        });
    }
};

module.exports.likeComment = async (req, res) => {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    const comment = post.comments.id(commentId);

    comment.likes += 1;
    await post.save();

    res.json({ message: 'Comment liked!', likes: comment.likes });
};
