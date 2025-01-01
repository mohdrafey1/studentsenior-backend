const Notes = require('../models/Notes');
const Colleges = require('../models/Colleges');

module.exports = {
    index: async (req, res) => {
        let notes = await Notes.find({}).populate('college');
        res.render('notes/index.ejs', { notes });
    },
    createNotesForm: async (req, res) => {
        const colleges = await Colleges.find();
        res.render('notes/new.ejs', { colleges });
    },
    createNotes: async (req, res) => {
        const { subjectName, description, by, link, college, status, target } =
            req.body;
        const newNotes = new Notes({
            subjectName,
            description,
            by,
            target,
            link,
            college,
            status,
        });
        newNotes.by = req.user._id;
        await newNotes.save();
        req.flash('success', 'Notes Created Successfully');
        return res.redirect(`/notes`);
    },
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
        let { subjectName, description, by, link, college, status, target } =
            req.body;

        const updateData = {
            subjectName,
            description,
            by,
            target,
            link,
            college,
            status: status === 'true',
        };

        const updatedNotes = await Notes.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        if (!updatedNotes) {
            req.flash('error', 'Notes not found');
            return res.redirect('/notes');
        }

        req.flash('success', 'Updated Successfully');
        res.redirect(`/notes`);
    },
    deleteNotes: async (req, res) => {
        await Notes.findByIdAndDelete(req.params.id);
        res.redirect(`/notes`);
    },
};
