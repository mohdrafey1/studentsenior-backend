const Notes = require('../../models/Notes');

// Fetch all Notes with status true
module.exports.fetchNotes = async (req, res) => {
    try {
        const notes = await Notes.find({ status: true }).populate('by');
        res.json(notes);
    } catch (err) {
        console.error('Error fetching Notes:', err);
        res.status(500).json({ message: 'Error fetching Notes' });
    }
};

module.exports.fetchNotesByCollege = async (req, res) => {
    try {
        const { collegeId } = req.params;

        const notes = await Notes.find({
            status: true,
            college: collegeId,
        })
            .populate('by')
            .sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error on the backend' });
    }
};

// Create a new Notes
// module.exports.createNotes = async (req, res) => {
//     const { subjectName, description, by, link, college, status, target } =
//         req.body;

//     try {
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
//     } catch (err) {
//         console.error('Error creating NOtes:', err);
//         res.status(500).json({ message: 'Error creating Notes' });
//     }
// };
