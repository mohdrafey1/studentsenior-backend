const Colleges = require('../../models/Colleges');
const { errorHandler } = require('../../utils/error');

module.exports.fetchCollege = async (req, res, next) => {
    const allColleges = await Colleges.find({ status: true }).sort({
        clickCounts: -1,
    });
    res.json(allColleges);
};

module.exports.fetchCollegeById = async (req, res, next) => {
    const { collegeId } = req.params;

    const college = await Colleges.findOne({
        _id: collegeId,
        status: true,
    });

    if (!college) {
        return next(errorHandler(404, 'College not Found'));
    }

    college.clickCounts += 1;
    await college.save();

    res.status(200).json(college);
};

module.exports.createCollege = async (req, res, next) => {
    const { name, location, description } = req.body;

    const client = req.user.id;

    const slug = name.replace(/\s+/g, '-').toLowerCase();

    const existingCollege = await Colleges.findOne({ slug });

    if (existingCollege) {
        return next(
            errorHandler(400, 'College with this name already exists.')
        );
    }

    const newCollege = new Colleges({
        name,
        location,
        description,
        owner: '66cb98fca9c088fc1180070e',
        client,
        slug,
    });
    await newCollege.save();
    res.json({
        message: 'College submitted successfully and is pending approval.',
    });
};
