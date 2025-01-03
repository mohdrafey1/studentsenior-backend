const Notes = require('../../models/Notes');
const Subject = require('../../models/Subjects');
const Client = require('../../models/Client.js');

// Fetch all Notes with status true
module.exports.fetchNotes = async (req, res) => {
    const notes = await Notes.find({ status: true }).populate('owner');
    res.json(notes);
};

module.exports.fetchNotesByCollege = async (req, res) => {
    const { collegeId } = req.params;

    const notes = await Notes.find({
        status: true,
        college: collegeId,
    })
        .populate('owner')
        .sort({ createdAt: -1 });
    res.status(200).json(notes);
};

// Create a new Notes
module.exports.createNotes = async (req, res, next) => {
    const { subject, description, title, fileUrl, college, owner } = req.body;

    console.log(req.body);

    const user = await Client.findById(owner);
    const slug = (title + user.username).toString();

    const newNotes = new Notes({
        subject,
        title,
        description,
        owner,
        slug,
        fileUrl,
        college,
    });

    if (subject) {
        const subjectNotesCount = await Subject.findById(subject);
        if (subjectNotesCount) {
            subjectNotesCount.totalNotes += 1;
            await subjectNotesCount.save();
        }
    }
    await newNotes.save();

    res.json({
        description: 'Notes submitted successfully and is pending approval.',
    });
};
