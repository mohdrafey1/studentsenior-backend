const Post = require('../models/Post');

module.exports.fetchPost = async (req, res) => {
    let allPost = await Post.find({}).populate('college').populate('author');
    res.render('community/index', { allPost });
};

module.exports.showPost = async (req, res) => {
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
        req.flash('error', 'The Post you requested does not exist');
        return res.redirect('/community');
    }
    res.render('community/show', { post });
};

module.exports.editPostForm = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
        req.flash('error', 'Senior Not Found');
        res.redirect('/community');
    }
    res.render('community/edit.ejs', { post });
};

module.exports.editPost = async (req, res) => {
    const { id } = req.params;
    const { content, isAnonymous } = req.body;

    await Post.findByIdAndUpdate(id, { content, isAnonymous }, { new: true });
    req.flash('success', 'Post Updated Successfully');
    res.redirect(`/community/${id}`);
};

module.exports.deletePost = async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    req.flash('success', 'Post Deleted Successfully');
    res.redirect('/community');
};

//currently not working will fix later
module.exports.deleteComment = async (req, res) => {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    // if (!post) {
    //     return res.status(404).json({ message: 'Post not found' });
    // }

    // const comment = post.comments.id(commentId);
    // if (!comment) {
    //     return res.status(404).json({ message: 'Comment not found' });
    // }

    // if (comment.author.toString() !== req.user.id) {
    //     return res.status(403).json({
    //         description: 'You are not authorized to delete this comment',
    //     });
    // }

    // Remove the comment by pulling it out of the array
    post.comments.pull({ _id: commentId });
    await post.save();

    req.flash('success', 'comment deleted successfully');
    res.redirect(`/community/${postId}`);
};
