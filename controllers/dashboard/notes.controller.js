const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const Notes = require('../../models/Notes');
const Colleges = require('../../models/Colleges');
const Subject = require('../../models/Subjects');
const Client = require('../../models/Client');
const { Course, Branch } = require('../../models/CourseBranch');
const Transaction = require('../../models/Transaction');
const s3 = require('../../config/s3.js');

module.exports = {
    index: async (req, res) => {
        let notes = await Notes.find({})
            .populate('college', 'name')
            .populate('owner', 'username')
            .populate('subject', 'subjectName')
            .sort({ createdAt: -1 });

        // console.log(notes);

        res.render('notes/index.ejs', { notes });
    },

    // createNotesForm: async (req, res) => {
    //     const colleges = await Colleges.find();
    //     res.render('notes/new.ejs', { colleges });
    // },

    // createNotes: async (req, res) => {
    //     const { subjectName, description, by, link, college, status, target } =
    //         req.body;
    //     const newNotes = new Notes({
    //         subjectName,
    //         description,
    //         by,
    //         target,
    //         link,
    //         college,
    //         status,
    //     });
    //     newNotes.by = req.user._id;
    //     await newNotes.save();
    //     req.flash('success', 'Notes Created Successfully');
    //     return res.redirect(`/notes`);
    // },

    editNotesForm: async (req, res) => {
        const colleges = await Colleges.find();
        const { id } = req.params;
        const notes = await Notes.findById(id);
        if (!notes) {
            req.flash('error', 'Notes not found!');
            return res.redirect(`/notes`);
        }
        res.render('notes/edit', { notes, colleges });
    },

    editNotes: async (req, res) => {
        const { id } = req.params;
        let { description, title, status, slug } = req.body;

        const updateData = {
            title,
            description,
            slug,
            status: status === 'true',
        };

        const updatedNotes = await Notes.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        if (!updatedNotes) {
            req.flash('error', 'Notes not found');
            return res.redirect('/notes');
        }

        if (updatedNotes.status === true) {
            const client = await Client.findById(updatedNotes.owner);
            if (client) {
                // Check if the client has already been rewarded for this Notes resource
                const existingTransaction = await Transaction.findOne({
                    user: client._id,
                    resourceId: updatedNotes._id,
                    resourceType: 'notes',
                    type: 'earn',
                });

                // If no such transaction exists, proceed with crediting the client
                if (!existingTransaction) {
                    // Update client reward points and balance
                    client.rewardPoints += updatedNotes.rewardPoints;
                    client.rewardBalance += updatedNotes.rewardPoints;

                    await client.save();

                    // Create a new transaction for the reward
                    const transaction = new Transaction({
                        user: client._id,
                        type: 'earn',
                        points: updatedNotes.rewardPoints,
                        resourceType: 'notes',
                        resourceId: updatedNotes._id,
                    });

                    await transaction.save();
                }
            }
        }

        req.flash('success', 'Updated Successfully');
        res.redirect('/notes');
    },

    deleteNotes: async (req, res) => {
        const { id } = req.params;
        const notes = await Notes.findById(id);

        if (!notes) {
            req.flash('error', 'Notes not found');
            return res.redirect('/notes');
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
            req.flash('error', 'Failed to delete file from storage');
            return res.redirect('/notes');
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

        req.flash('success', 'Notes deleted successfully');
        res.redirect('/notes');
    },
};
