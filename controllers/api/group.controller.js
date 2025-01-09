const WhatsappGroup = require('../../models/WhatsappGroup');

// Fetch all PYQs with status true
module.exports.fetchGroups = async (req, res) => {
    const groups = await WhatsappGroup.find({ status: true });
    res.json(groups);
};

module.exports.fetchGroupsByCollege = async (req, res) => {
    const { collegeId } = req.params;
    const groups = await WhatsappGroup.find({
        status: true,
        college: collegeId,
    });
    res.json(groups);
};

module.exports.createGroup = async (req, res) => {
    const { title, info, domain, link, college, status } = req.body;
    // console.log(req.body);

    const newGroup = new WhatsappGroup({
        title,
        domain,
        info,
        link,
        college,
    });

    await newGroup.save();

    res.json({
        message: 'Group submitted successfully and is pending approval.',
    });
};
