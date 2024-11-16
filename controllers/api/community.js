const Post = require('../../models/Post');

module.exports.fetchPost = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('college')
            .populate('author')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                },
            });
        res.json(posts);
    } catch (err) {
        console.error('Error fetching Posts', err);
        res.status(500).json({ message: 'Error Fetching Posts' });
    }
};

module.exports.fetchPostByCollege = async (req, res) => {
    try {
        const { collegeId } = req.params;
        const posts = await Post.find({ college: collegeId })
            .sort({
                createdAt: -1,
            })
            .populate('college')
            .populate('author')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                },
            });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({
            message: 'Something Error occur on the backend',
        });
    }
};

module.exports.fetchPostbyId = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('college')
            .populate('author')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                },
            });
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Some error occurred on the server' });
    }
};

module.exports.createPost = async (req, res) => {
    const { content, isAnonymous, college } = req.body;
    let author = req.user.id;
    try {
        const newPost = new Post({ content, isAnonymous, college, author });
        await newPost.save();
        res.json({ description: 'Post Created Succesfully' });
    } catch (err) {
        console.error('Error Adding Post ', err);
        res.json({ message: `Error Adding Post ${err}` });
    }
};

module.exports.updatePost = async (req, res) => {
    try {
        const { content, isAnonymous, college } = req.body;

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post Not Found ' });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'You are Not Authorized to Update this post',
            });
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

        res.json({ description: 'Post Updated Succesfully ', updatedPost });
    } catch (err) {
        res.status(500).json({ message: 'Error in Updating Post' });
    }
};

module.exports.deletePost = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post Not Found ' });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'You are Not Authorized to delete this post',
            });
        }
        await Post.findByIdAndDelete(postId);
        res.json({ description: 'Post Deleted Successfully' });
    } catch (err) {
        res.status(500).json({ message: `Error Deleting Post ${err}` });
    }
};

module.exports.createComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;
        const { content } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
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

        res.json({ description: 'Commented Successfully' });
    } catch (err) {
        console.error('Error Creating Comment', err);
        res.status(500).json({ message: `Error Creating Comment ${err}` });
    }
};

module.exports.updateComment = async (req, res) => {
    const { postId, commentId } = req.params;

    const { content } = req.body;
    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'You are Not Authorized to Edit this Comment',
            });
        }

        comment.content = content;
        await post.save();

        res.json({ description: 'comment updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'error deleting comment ' });
    }
};

module.exports.deleteComment = async (req, res) => {
    const { postId, commentId } = req.params;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'You are not authorized to delete this comment',
            });
        }

        // Remove the comment by pulling it out of the array
        post.comments.pull({ _id: commentId });
        await post.save();

        return res.json({ description: 'Comment deleted successfully' });
    } catch (err) {
        console.error('Error deleting comment:', err);
        return res.status(500).json({ message: 'Error deleting comment' });
    }
};

module.exports.likePost = async (req, res) => {
    const userId = req.user.id;
    const postId = req.params.id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user has already liked the post
        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            // If already liked, remove the like (unlike the post)
            post.likes = post.likes.filter(
                (id) => id.toString() !== userId.toString()
            );
            await post.save();
            return res.json({
                message: 'Post unliked!',
                likes: post.likes.length,
            });
        } else {
            // If not liked, add the like
            post.likes.push(userId);
            await post.save();
            return res.json({
                message: 'Post liked!',
                likes: post.likes.length,
            });
        }
    } catch (err) {
        console.error('Error liking/unliking post:', err);
        return res.status(500).json({ message: 'Error liking/unliking post' });
    }
};

module.exports.likeComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;

        // Find the post and the specific comment
        const post = await Post.findById(postId);
        const comment = post.comments.id(commentId);

        // Increment the like count
        comment.likes += 1;
        await post.save();

        res.json({ message: 'Comment liked!', likes: comment.likes });
    } catch (error) {
        console.log(error);
    }
};
