const Colleges = require('../../models/Colleges');
const NewPyqs = require('../../models/NewPyqs');

module.exports.getAllPyqs = async (req, res) => {
    const { collegeName } = req.params;

    const college = await Colleges.findOne({ slug: collegeName });

    const collegeId = college._id;

    const allPyqs = await NewPyqs.find({ college: collegeId })
        .populate('subject', 'subjectName')
        .populate('owner', 'username')
        .sort({ createdAt: -1 });

    res.status(200).json(allPyqs);
};
