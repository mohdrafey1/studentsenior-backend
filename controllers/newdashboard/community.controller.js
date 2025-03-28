const Post = require('../../models/Post');
const Colleges = require('../../models/Colleges');

module.exports.getAllPost = async (req, res) => {
    const { collegeName } = req.params;

    const college = await Colleges.findOne({ slug: collegeName });

    const collegeId = college._id;

    const allPosts = await Post.find({ college: collegeId })
        .populate('college', 'name')
        .populate('author', 'username')
        .sort({ createdAt: -1 });

    res.status(200).json(allPosts);
};
