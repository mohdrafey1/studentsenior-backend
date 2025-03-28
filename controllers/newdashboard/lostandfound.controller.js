const LostFound = require('../../models/LostFound');
const Colleges = require('../../models/Colleges');

module.exports.getAllLostFoundItems = async (req, res) => {
    const { collegeName } = req.params;

    const college = await Colleges.findOne({ slug: collegeName });

    const collegeId = college._id;

    const allLostFoundItems = await LostFound.find({ college: collegeId })
        .populate('college', 'name')
        .populate('owner', 'username')
        .sort({ createdAt: -1 });

    res.status(200).json(allLostFoundItems);
};
