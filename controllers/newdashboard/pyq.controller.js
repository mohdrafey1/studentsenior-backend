const Colleges = require('../../models/Colleges');
const NewPyqs = require('../../models/NewPyqs');
const PyqRequest = require('../../models/PyqRequest');
const Client = require('../../models/Client');
const Transaction = require('../../models/Transaction');
const Subject = require('../../models/Subjects.js');
const { Branch, Course } = require('../../models/CourseBranch.js');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../../config/s3.js');

module.exports.getRequestedPyqs = async (req, res, next) => {
    const { collegeName } = req.params;
    const college = await Colleges.findOne({ slug: collegeName });

    if (!college) return res.status(404).json({ message: 'College not found' });

    const allRequestedPyqs = await PyqRequest.find({
        college: college._id,
    }).sort({ createdAt: -1 });
    res.status(200).json(allRequestedPyqs);
};

module.exports.getAllPyqs = async (req, res, next) => {
    const { collegeName } = req.params;
    const college = await Colleges.findOne({ slug: collegeName });

    if (!college) return res.status(404).json({ message: 'College not found' });

    const allPyqs = await NewPyqs.find({ college: college._id })
        .populate('subject', 'subjectName')
        .populate('owner', 'username')
        .sort({ createdAt: -1 });

    res.status(200).json(allPyqs);
};

module.exports.editPyqs = async (req, res, next) => {
    const { id } = req.params;
    const { year, examType, status, slug, price } = req.body;

    const updatedPyq = await NewPyqs.findByIdAndUpdate(
        id,
        { year, examType, slug, price, status },
        { new: true }
    );

    if (!updatedPyq) {
        return res.status(404).json({ message: 'PYQ not found' });
    }

    if (updatedPyq.status === true) {
        const client = await Client.findById(updatedPyq.owner);

        if (client) {
            const existingTransaction = await Transaction.findOne({
                user: client._id,
                resourceId: updatedPyq._id,
                resourceType: 'pyq',
                type: 'earn',
            });

            if (!existingTransaction) {
                let rewardPoints = updatedPyq.rewardPoints;

                const maxOfferUses = 5;
                if (!client.examOfferUploadCountPyqs)
                    client.examOfferUploadCountPyqs = 0;

                if (client.examOfferUploadCountPyqs < maxOfferUses) {
                    rewardPoints = rewardPoints * 5;
                    client.examOfferUploadCountPyqs += 1;
                }

                client.rewardPoints += rewardPoints;
                client.rewardBalance += rewardPoints;
                await client.save();

                await Transaction.create({
                    user: client._id,
                    type: 'earn',
                    points: rewardPoints,
                    resourceType: 'pyq',
                    resourceId: updatedPyq._id,
                });
            }
        }
    }

    res.status(200).json({ message: 'Updated Successfully', updatedPyq });
};

module.exports.deletePyqs = async (req, res, next) => {
    const { id } = req.params;
    const pyqs = await NewPyqs.findById(id);

    if (!pyqs) return res.status(404).json({ message: 'PYQ not found' });

    const { fileUrl, subject, owner, rewardPoints } = pyqs;

    // Delete the file from S3
    try {
        const bucketName = process.env.S3_BUCKET_NAME;
        const region = process.env.AWS_REGION;
        const s3Key = fileUrl.replace(
            `https://${bucketName}.s3.${region}.amazonaws.com/`,
            ''
        );

        await s3.send(
            new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key })
        );
    } catch (err) {
        console.error('Error deleting file from S3:', err);
    }

    // Update related Subject, Branch, and Course counts
    const updatedSubject = await Subject.findByIdAndUpdate(
        subject,
        { $inc: { totalPyqs: -1 } },
        { new: true }
    );

    if (updatedSubject) {
        const branch = await Branch.findByIdAndUpdate(
            updatedSubject.branch,
            { $inc: { totalPyqs: -1 } },
            { new: true }
        );
        if (branch) {
            await Course.findByIdAndUpdate(branch.course, {
                $inc: { totalPyqs: -1 },
            });
        }
    }

    // Update client reward points and create a reduction transaction if credited
    const client = await Client.findById(owner);
    if (client && rewardPoints > 0) {
        const existingTransaction = await Transaction.findOne({
            user: client._id,
            resourceId: pyqs._id,
            resourceType: 'pyq',
            type: 'earn',
        });

        if (existingTransaction) {
            client.rewardPoints -= rewardPoints;
            client.rewardBalance -= rewardPoints;
            await client.save();

            await Transaction.create({
                user: client._id,
                type: 'reduction',
                points: rewardPoints,
                resourceType: 'pyq',
                resourceId: pyqs._id,
            });
        }
    }

    await pyqs.deleteOne();
    res.status(200).json({ message: 'Deleted Successfully' });
};
