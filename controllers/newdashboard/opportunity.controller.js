const { GiveOpportunity } = require('../../models/Opportunity');
const Colleges = require('../../models/Colleges');

module.exports.getAllOpportunites = async (req, res) => {
    const { collegeName } = req.params;

    const college = await Colleges.findOne({ slug: collegeName });

    const collegeId = college._id;

    const allOpportunites = await GiveOpportunity.find({ college: collegeId })

        .populate('owner', 'username')
        .sort({ createdAt: -1 });

    res.status(200).json(allOpportunites);
};
