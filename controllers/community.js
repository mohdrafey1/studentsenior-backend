const Post = require('../models/Post');

module.exports.fetchPost = async (req, res) => {
    try {
        let allPost = await Post.find({})
            .populate('college')
            .populate('author');
        res.render('community/index', { allPost });
    } catch (err) {
        console.error('Something error Occured', err);
        res.redirect('/');
    }
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
    try {
        await Post.findByIdAndUpdate(
            id,
            { content, isAnonymous },
            { new: true }
        );
        req.flash('success', 'Post Updated Successfully');
        res.redirect(`/community/${id}`);
    } catch (err) {
        console.error('Error occurred', err);
        req.flash('error', 'Something went wrong');
        res.redirect(`/community/${id}`);
    }
};

module.exports.deletePost = async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    req.flash('success', 'Post Deleted Successfully');
    res.redirect('/community');
};

module.exports.deleteComment = async (req, res) => {
    const { postId, commentId } = req.params;
    console.log(req.params);
    try {
        await Post.findByIdAndUpdate(
            postId,
            { $pull: { comments: { _id: commentId } } },
            { new: true }
        );

        req.flash('success', 'Comment deleted successfully');
        res.redirect(`/community/${postId}`);
    } catch (err) {
        console.error('Error occurred while deleting comment:', err);
        req.flash('error', 'Could not delete the comment');
        res.redirect(`/community/${postId}`);
    }
};
