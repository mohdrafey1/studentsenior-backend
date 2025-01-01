const Notes = require('../../models/Notes');

// Fetch all Notes with status true
module.exports.fetchNotes = async (req, res) => {
    const notes = await Notes.find({ status: true }).populate('by');
    res.json(notes);
};

module.exports.fetchNotesByCollege = async (req, res) => {
    const { collegeId } = req.params;

    const notes = await Notes.find({
        status: true,
        college: collegeId,
    })
        .populate('by')
        .sort({ createdAt: -1 });
    res.status(200).json(notes);
};

// Create a new Notes
// module.exports.createNotes = async (req, res) => {
//     const { subjectName, description, by, link, college, status, target } =
//         req.body;

//
//         const newNotes = new Notes({
//             subjectName,
//             description,
//             by,
//             target,
//             link,
//             college,
//             status,
//         });

//         await newNotes.save();

//         res.json({
//             description: 'Notes submitted successfully and is pending approval.',
//         });
//
// };
