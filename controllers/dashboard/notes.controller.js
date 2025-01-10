const Notes = require('../../models/Notes');
const Colleges = require('../../models/Colleges');
const Subject = require('../../models/Subjects');
const Client = require('../../models/Client');
const { Course, Branch } = require('../../models/CourseBranch');
const Transaction = require('../../models/Transaction');

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
                client.rewardPoints += updatedNotes.rewardPoints;
                client.rewardBalance += updatedNotes.rewardPoints;

                await client.save();

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

        req.flash('success', 'Updated Successfully');
        res.redirect('/notes');
    },

    deleteNotes: async (req, res) => {
        const { id } = req.params;
        const notes = await Notes.findById(id);

        if (notes) {
            const subject = await Subject.findById(notes.subject);

            const newSubject = await Subject.findByIdAndUpdate(
                subject._id,
                { $inc: { totalNotes: -1 } },
                { new: true }
            );

            const branch = await Branch.findByIdAndUpdate(
                newSubject.branch,
                { $inc: { totalNotes: -1 } },
                { new: true }
            );
            if (branch) {
                await Course.findByIdAndUpdate(branch.course, {
                    $inc: { totalNotes: -1 },
                });
            }

            const client = await Client.findById(notes.owner);
            if (client) {
                client.rewardPoints -= notes.rewardPoints;
                client.rewardBalance -= notes.rewardPoints;

                await client.save();

                const transaction = new Transaction({
                    user: client._id,
                    type: 'reduction',
                    points: notes.rewardPoints,
                    resourceType: 'notes',
                    resourceId: notes._id,
                });

                await transaction.save();
            }

            await notes.deleteOne();
        }

        req.flash('success', 'Notes deleted successfully');
        res.redirect('/notes');
    },
};
