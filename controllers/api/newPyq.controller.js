const Newpyq = require('../../models/NewPyqs.js');
const { Course, Branch } = require('../../models/CourseBranch.js');
const Transaction = require('../../models/Transaction.js');
const Subject = require('../../models/Subjects');
const Client = require('../../models/Client.js');
const { errorHandler } = require('../../utils/error.js');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../../config/s3.js');
const Colleges = require('../../models/Colleges.js');

const bucketName = process.env.S3_BUCKET_NAME;
const region = process.env.AWS_REGION;

module.exports.fetchPyqsByCollege = async (req, res, next) => {
    const { collegeId } = req.params;

    const pyqs = await Newpyq.find({
        college: collegeId,
        status: true,
    })
        .populate({
            path: 'subject',
            select: 'subjectCode subjectName semester branch',
            populate: {
                path: 'branch',
                select: 'branchName branchCode course',
                populate: {
                    path: 'course',
                    select: 'courseCode courseName',
                },
            },
        })
        .sort({ createdAt: -1 });

    res.status(200).json(pyqs);
};

module.exports.fetchPyqsByCollegeBranch = async (req, res, next) => {
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
        .populate('subject', 'subjectName subjectCode semester')
        .populate('owner', 'username profilePicture')
        .sort({ clickCounts: -1 });

    res.status(200).json({ pyqs, subjectName: subject.subjectName });
};

module.exports.createPyq = async (req, res, next) => {
    const {
        year,
        examType,
        college,
        fileUrl,
        subjectCode,
        branchCode,
        solved,
        isPaid,
        price,
    } = req.body;

    const deleteFileFromS3 = async () => {
        if (fileUrl) {
            const s3Key = fileUrl.replace(
                `https://${bucketName}.s3.${region}.amazonaws.com/`,
                ''
            );
            try {
                await s3.send(
                    new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key })
                );
            } catch (err) {
                console.error('Error deleting file from S3:', err);
            }
        }
    };

    try {
        if (!fileUrl) {
            return next(errorHandler(400, 'No file uploaded'));
        }

        const branch = await Branch.findOne({
            branchCode: { $regex: new RegExp(`^${branchCode}$`, 'i') },
        });

        if (!branch) {
            await deleteFileFromS3();
            return res.status(404).json({ message: 'Branch not found' });
        }

        const subject = await Subject.findOne({
            subjectCode: { $regex: new RegExp(`^${subjectCode}$`, 'i') },
            branch: branch._id,
        });

        if (!subject) {
            await deleteFileFromS3();
            return next(errorHandler(403, 'Subject not found'));
        }

        let subjectId = subject._id;

        let owner = req.user.id;

        const user = await Client.findById(owner);

        const sanitize = (text) =>
            text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9\-]/g, '');

        const defaultCollege = '66cb9952a9c088fc11800714';

        let slug = `${sanitize(subject.subjectName)}-${sanitize(
            examType
        )}-${year}-${sanitize(branchCode)}`;

        if (college.toString() !== defaultCollege.toString()) {
            const collegeDoc = await Colleges.findById(college);
            const takeCollegeFirst3Char = sanitize(collegeDoc.name).slice(0, 4);
            slug += `-${takeCollegeFirst3Char}`;
        }

        if (solved === true) {
            slug += `-solved-${sanitize(user.username)}`;
        }

        if (isPaid && (!price || price <= 0)) {
            await deleteFileFromS3();
            return next(
                errorHandler(
                    400,
                    'Please provide a valid price for paid content'
                )
            );
        }

        const slugExists = await Newpyq.findOne({ slug });
        if (slugExists) {
            await deleteFileFromS3();
            return next(
                errorHandler(409, 'This Pyq Already exist please check')
            );
        }

        const newPyq = new Newpyq({
            subject: subjectId,
            year,
            examType,
            owner,
            slug,
            fileUrl,
            college,
            solved,
            isPaid,
            price,
        });

        const totalPyqsinSubject = await Subject.findByIdAndUpdate(subjectId, {
            $inc: { totalPyqs: 1 },
        });

        const totalPyqsinbranch = await Branch.findByIdAndUpdate(branch._id, {
            $inc: { totalPyqs: 1 },
        });

        const totalPyqsincourse = await Course.findByIdAndUpdate(
            branch.course,
            {
                $inc: { totalPyqs: 1 },
            }
        );

        await newPyq.save();

        res.json({
            message:
                'Pyq submitted successfully and is pending approval , Once Approved you will get your reward.',
        });
    } catch (error) {
        await deleteFileFromS3();
        next(error);
    }
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

module.exports.purchasePyq = async (req, res, next) => {
    const pyqId = req.params.id;
    const userId = req.user.id;

    // Find the PYQ
    const pyq = await Newpyq.findById(pyqId);
    if (!pyq) {
        return next(errorHandler(403, 'PYQ not found'));
    }

    // Check if already purchased
    if (pyq.purchasedBy.includes(userId)) {
        return next(errorHandler(409, 'You have already purchased this PYQ'));
    }

    // Get user details
    const user = await Client.findById(userId);
    if (!user) {
        return next(errorHandler(403, 'User not found'));
    }

    // Check if user has enough points
    if (user.rewardBalance < pyq.price) {
        return next(errorHandler(404, 'Insufficient points'));
    }

    // Deduct points from the purchaser
    user.rewardBalance -= pyq.price;
    user.purchasedPYQs.push(pyqId);
    await user.save();

    // Record the purchase
    pyq.purchasedBy.push(userId);
    await pyq.save();

    // Credit 70% to the PYQ owner's account
    const ownerId = pyq.owner;
    const owner = await Client.findById(ownerId);
    if (owner) {
        const creditAmount = Math.floor(pyq.price * 0.7); // 70% of the price
        owner.rewardBalance += creditAmount;
        owner.rewardPoints += creditAmount;
        await owner.save();

        // Create a transaction for the owner
        const ownerTransaction = new Transaction({
            user: ownerId,
            type: 'pyq-sale',
            points: creditAmount,
            resourceType: 'pyq',
            resourceId: pyq._id,
        });
        await ownerTransaction.save();
    }

    // Create a transaction for the purchaser
    const transaction = new Transaction({
        user: userId,
        type: 'pyq-purchase',
        points: pyq.price,
        resourceType: 'pyq',
        resourceId: pyq._id,
    });
    await transaction.save();

    res.status(200).json({ success: true, message: 'Purchase successful' });
};

module.exports.deletePyq = async (req, res, next) => {
    const { id } = req.params;

    const pyq = await Newpyq.findById(id);

    if (!pyq) {
        return next(errorHandler(404, 'Pyq not found'));
    }

    const { fileUrl, subject, owner, rewardPoints } = pyq;

    const s3Key = fileUrl.replace(
        `https://${bucketName}.s3.${region}.amazonaws.com/`,
        ''
    );

    await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key }));

    const newSubject = await Subject.findByIdAndUpdate(
        subject,
        { $inc: { totalPyqs: -1 } },
        { new: true }
    );

    const branch = await Branch.findByIdAndUpdate(
        newSubject.branch,
        { $inc: { totalPyqs: -1 } },
        { new: true }
    );
    if (branch) {
        await Course.findByIdAndUpdate(branch.course, {
            $inc: { totalPyqs: -1 },
        });
    }

    if (owner && rewardPoints > 0) {
        const client = await Client.findById(owner);
        if (client) {
            client.rewardPoints -= rewardPoints;
            client.rewardBalance -= rewardPoints;

            await client.save();

            const transaction = new Transaction({
                user: client._id,
                type: 'reduction',
                points: rewardPoints,
                resourceType: 'pyq',
                resourceId: pyq._id,
            });

            await transaction.save();
        }
    }

    // Delete the note
    await Newpyq.deleteOne({ _id: id });

    res.json({ message: 'Pyq deleted successfully' });
};

module.exports.editPyq = async (req, res) => {
    const updatedPyq = await Newpyq.findByIdAndUpdate(
        req.params.id,
        {
            isPaid: req.body.isPaid,
            price: req.body.isPaid ? req.body.price : 0,
        },
        { new: true }
    );
    res.json({ success: true, data: updatedPyq });
};
