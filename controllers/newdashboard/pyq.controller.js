const Colleges = require('../../models/Colleges');
const NewPyqs = require('../../models/NewPyqs');
const PyqRequest = require('../../models/PyqRequest');

module.exports.getRequestedPyqs = async (req, res) => {
    const { collegeName } = req.params;

    const college = await Colleges.findOne({ slug: collegeName });

    const collegeId = college._id;

    const allRequestedPyqs = await PyqRequest.find({ college: collegeId }).sort(
        { createdAt: -1 }
    );

    res.status(200).json(allRequestedPyqs);
};

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
