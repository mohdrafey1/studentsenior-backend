const Colleges = require('../../models/Colleges');
const { errorHandler } = require('../../utils/error');

module.exports.fetchCollege = async (req, res, next) => {
    const allColleges = await Colleges.find({ status: true });
    res.json(allColleges);
};

module.exports.fetchCollegeById = async (req, res, next) => {
    const { collegeId } = req.params;
    const college = await Colleges.findOne({
        status: true,
        _id: collegeId,
    });

    if (!college) {
        return next(errorHandler(401, 'College not Found'));
    }

    res.status(200).json(college);
};

module.exports.createCollege = async (req, res, next) => {
    const { name, location, description } = req.body;

    const client = req.user.id;

    const newCollege = new Colleges({
        name,
        location,
        description,
        owner: '66cb98fca9c088fc1180070e',
        client,
    });
    await newCollege.save();
    res.json({
        description: 'College submitted successfully and is pending approval.',
    });
};
