const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../../config/s3.js');
const Subject = require('../../models/Subjects');
const Client = require('../../models/Client');
const { Course, Branch } = require('../../models/CourseBranch');
const Transaction = require('../../models/Transaction');
const NewPyqs = require('../../models/NewPyqs');

module.exports = {
    index: async (req, res) => {
        let pyqs = await NewPyqs.find({})
            .populate('college', 'name')
            .populate('owner', 'username')
            .populate('subject', 'subjectName')
            .sort({ createdAt: -1 });

        res.render('newPyq/index.ejs', { pyqs });
    },

    editPyqsForm: async (req, res) => {
        const { id } = req.params;
        const pyqs = await NewPyqs.findById(id).populate({
            path: 'subject',
            populate: {
                path: 'branch',
            },
        });
        if (!pyqs) {
            req.flash('error', 'Pyq not found!');
            return res.redirect(`/newpyqs`);
        }
        res.render('newPyq/edit', { pyqs });
    },

    editPyqs: async (req, res) => {
        const { id } = req.params;
        let { year, examType, status, slug } = req.body;

        const updateData = {
            year,
            examType,
            slug,
            status: status === 'true',
        };

        const updatedPyq = await NewPyqs.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        if (!updatedPyq) {
            req.flash('error', 'Pyq not found');
            return res.redirect('/newpyqs');
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
                    client.rewardPoints += updatedPyq.rewardPoints;
                    client.rewardBalance += updatedPyq.rewardPoints;

                    await client.save();
                    const transaction = new Transaction({
                        user: client._id,
                        type: 'earn',
                        points: updatedPyq.rewardPoints,
                        resourceType: 'pyq',
                        resourceId: updatedPyq._id,
                    });

                    await transaction.save();
                }
            }
        }

        req.flash('success', 'Updated Successfully');
        res.redirect('/newpyqs');
    },

    deletePyqs: async (req, res) => {
        const { id } = req.params;
        const pyqs = await NewPyqs.findById(id);

        if (!pyqs) {
            req.flash('error', 'Pyqs not found');
            return res.redirect('/newpyqs');
        }

        const { fileUrl, subject, owner, rewardPoints } = pyqs;

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
            req.flash('error', 'Failed to delete file from storage');
            return res.redirect('/newpyqs');
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
            // Check if an "earn" transaction exists for this Pyq
            const existingTransaction = await Transaction.findOne({
                user: client._id,
                resourceId: pyqs._id,
                resourceType: 'pyq',
                type: 'earn',
            });

            if (existingTransaction) {
                // Reduce the client's reward points and balance
                client.rewardPoints -= rewardPoints;
                client.rewardBalance -= rewardPoints;

                await client.save();

                // Create a new "reduction" transaction
                const transaction = new Transaction({
                    user: client._id,
                    type: 'reduction',
                    points: rewardPoints,
                    resourceType: 'pyq',
                    resourceId: pyqs._id,
                });

                await transaction.save();
            }
        }

        await pyqs.deleteOne();

        req.flash('success', 'Pyqs deleted successfully');
        res.redirect('/newpyqs');
    },
};
