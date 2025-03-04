const WhatsappGroup = require('../../models/WhatsappGroup');
const Colleges = require('../../models/Colleges');

module.exports.getAllGroups = async (req, res) => {
    const { collegeName } = req.params;

    const college = await Colleges.findOne({ slug: collegeName });

    const collegeId = college._id;

    const allGroups = await WhatsappGroup.find({ college: collegeId }).sort({
        createdAt: -1,
    });

    res.status(200).json(allGroups);
};
