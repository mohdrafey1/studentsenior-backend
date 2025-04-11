const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const Notes = require('../../models/Notes');
const Colleges = require('../../models/Colleges');
const Subject = require('../../models/Subjects');
const Client = require('../../models/Client');
const { Course, Branch } = require('../../models/CourseBranch');
const Transaction = require('../../models/Transaction');
const s3 = require('../../config/s3.js');

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

module.exports.editNotes = async (req, res) => {
    const { id } = req.params;
    let { description, title, status, slug } = req.body;

    const updateData = {
        title,
        description,
        slug,
        status,
    };

    const updatedNotes = await Notes.findByIdAndUpdate(id, updateData, {
        new: true,
    });

    if (!updatedNotes) {
        return res.status(404).json({ message: 'Note not found' });
    }

    if (updatedNotes.status === true) {
        const client = await Client.findById(updatedNotes.owner);

        if (client) {
            const existingTransaction = await Transaction.findOne({
                user: client._id,
                resourceId: updatedNotes._id,
                resourceType: 'notes',
                type: 'earn',
            });

            if (!existingTransaction) {
                let rewardPoints = updatedNotes.rewardPoints;

                // Apply exam-time offer (max 5 times)
                const maxOfferUses = 5;
                if (!client.examOfferUploadCountNotes)
                    client.examOfferUploadCountNotes = 0;

                if (client.examOfferUploadCountNotes < maxOfferUses) {
                    rewardPoints = rewardPoints * 5; // Apply 5x reward
                    client.examOfferUploadCountNotes += 1;
                }

                // Update client rewards
                client.rewardPoints += rewardPoints;
                client.rewardBalance += rewardPoints;

                await client.save();

                // Record transaction
                await Transaction.create({
                    user: client._id,
                    type: 'earn',
                    points: rewardPoints,
                    resourceType: 'notes',
                    resourceId: updatedNotes._id,
                });
            }
        }
    }

    res.status(200).json({
        message: 'Note updated Successfully',
        updatedNotes,
    });
};

module.exports.deleteNotes = async (req, res) => {
    const { id } = req.params;
    const notes = await Notes.findById(id);

    if (!notes) {
        return res.status(404).json({ message: 'note not found' });
    }

    const { fileUrl, subject, owner, rewardPoints } = notes;

    const bucketName = process.env.S3_BUCKET_NAME;
    const region = process.env.AWS_REGION;
    const s3Key = fileUrl.replace(
        `https://${bucketName}.s3.${region}.amazonaws.com/`,
        ''
    );

    // Delete the file from S3
    try {
        await s3.send(
            new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key })
        );
    } catch (err) {
        console.error('Error deleting file from S3:', err);
        return res
            .status(404)
            .json({ message: 'Something error occured on the server' });
    }

    // Update the related subject, branch, and course
    const updatedSubject = await Subject.findByIdAndUpdate(
        subject,
        { $inc: { totalNotes: -1 } },
        { new: true }
    );

    if (updatedSubject) {
        const branch = await Branch.findByIdAndUpdate(
            updatedSubject.branch,
            { $inc: { totalNotes: -1 } },
            { new: true }
        );
        if (branch) {
            await Course.findByIdAndUpdate(branch.course, {
                $inc: { totalNotes: -1 },
            });
        }
    }

    // Check for existing "earn" transaction before reducing client rewards
    if (owner && rewardPoints > 0) {
        const client = await Client.findById(owner);
        if (client) {
            const existingTransaction = await Transaction.findOne({
                user: client._id,
                resourceId: notes._id,
                resourceType: 'notes',
                type: 'earn',
            });

            if (existingTransaction) {
                // Deduct reward points and balance
                client.rewardPoints -= rewardPoints;
                client.rewardBalance -= rewardPoints;

                await client.save();

                // Create a "reduction" transaction
                const transaction = new Transaction({
                    user: client._id,
                    type: 'reduction',
                    points: rewardPoints,
                    resourceType: 'notes',
                    resourceId: notes._id,
                });

                await transaction.save();
            }
        }
    }

    // Delete the note from the database
    await Notes.deleteOne({ _id: id });

    res.status(200).json({ message: 'Deleted Successfully' });
};
