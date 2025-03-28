const Colleges = require('../../models/Colleges');
const Notes = require('../../models/Notes');

module.exports.getAllNotes = async (req, res) => {
    const { collegeName } = req.params;

    const college = await Colleges.findOne({ slug: collegeName });

    const collegeId = college._id;

    const allNotes = await Notes.find({ college: collegeId })
        .populate('subject', 'subjectName')
        .populate('owner', 'username')
        .sort({ createdAt: -1 });

    res.status(200).json(allNotes);
};
