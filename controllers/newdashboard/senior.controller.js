const Senior = require('../../models/Senior');
const Colleges = require('../../models/Colleges');

module.exports.getAllSeniors = async (req, res) => {
    const { collegeName } = req.params;

    const college = await Colleges.findOne({ slug: collegeName });

    const collegeId = college._id;

    const allSeniors = await Senior.find({ college: collegeId })
        .populate('college', 'name')
        .populate('owner', 'username')
        .sort({ createdAt: -1 });

    res.status(200).json(allSeniors);
};
