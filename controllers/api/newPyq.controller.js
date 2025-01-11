const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const Newpyq = require('../../models/NewPyqs.js');
const { Course, Branch } = require('../../models/CourseBranch.js');
const Subject = require('../../models/Subjects');
const Client = require('../../models/Client.js');
const Transaction = require('../../models/Transaction.js');
const s3 = require('../../config/s3.js');
const { errorHandler } = require('../../utils/error.js');

module.exports.fetchPyqsByCollege = async (req, res, next) => {
    const { subjectCode, branchCode, collegeId } = req.params;

    const branch = await Branch.findOne({
        branchCode: { $regex: new RegExp(`^${branchCode}$`, 'i') },
    });

    if (!branch) {
        return res.status(404).json({ message: 'Branch not found' });
    }

    const subject = await Subject.findOneAndUpdate(
        {
            subjectCode: { $regex: new RegExp(`^${subjectCode}$`, 'i') },
            branch: branch._id,
        },
        { $inc: { clickCounts: 1 } },
        { new: true }
    );

    if (!subject) {
        return next(errorHandler(403, 'Subject not found'));
    }

    const pyqs = await Newpyq.find({
        subject: subject._id,
        college: collegeId,
        status: true,
    })
        .populate('subject', 'subjectName subjectCode')
        .sort({ clickCounts: -1 });

    res.status(200).json({ pyqs, subjectName: subject.subjectName });
};

module.exports.createPyq = async (req, res, next) => {
    const { year, examType, college, fileUrl, subjectCode, branchCode } =
        req.body;

    if (!fileUrl) {
        return next(errorHandler(404, 'No file uploaded'));
    }

    const branch = await Branch.findOne({
        branchCode: { $regex: new RegExp(`^${branchCode}$`, 'i') },
    });

    if (!branch) {
        return res.status(404).json({ message: 'Branch not found' });
    }

    const subject = await Subject.findOne({
        subjectCode: { $regex: new RegExp(`^${subjectCode}$`, 'i') },
        branch: branch._id,
    });

    if (!subject) {
        return next(errorHandler(403, 'Subject not found'));
    }

    let subjectId = subject._id;

    let owner = req.user.id;

    let slug = `${subject.subjectName}-${examType}-${year}`;
    slug = slug.toLowerCase().replace(/\s+/g, '-');

    const slugExists = await Newpyq.findOne({ slug });
    if (slugExists) {
        return next(errorHandler(409, 'This Pyq Already exist please check'));
    }

    const newPyq = new Newpyq({
        subject: subjectId,
        year,
        examType,
        owner,
        slug,
        fileUrl,
        college,
    });

    await Subject.findByIdAndUpdate(subjectId, { $inc: { totalPyqs: 1 } });

    const totalPyqsinbranch = await Branch.findByIdAndUpdate(branch._id, {
        $inc: { totalPyqs: 1 },
    });

    const totalPyqsincourse = await Course.findByIdAndUpdate(branch.course, {
        $inc: { totalPyqs: 1 },
    });

    await newPyq.save();

    res.json({
        message:
            'Pyq submitted successfully and is pending approval , Once Approved you will get your reward.',
    });
};

module.exports.getPyq = async (req, res, next) => {
    const pyq = await Newpyq.findOneAndUpdate(
        { slug: req.params.slug, status: true },
        { $inc: { clickCounts: 1 } },
        { new: true }
    )
        .populate('subject', 'subjectName subjectCode')
        .populate('owner', 'username profilePicture');

    if (!pyq) {
        return next(errorHandler(403, 'Pyq not found'));
    }

    res.json({ pyq });
};
