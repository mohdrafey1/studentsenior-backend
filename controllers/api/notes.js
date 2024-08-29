const Notes = require('../../models/Notes');

// Fetch all Notes with status true
module.exports.fetchNotes = async (req, res) => {
    try {
        const notes = await Notes.find({ status: true }).populate('by');
        res.json(notes);
    } catch (err) {
        console.error('Error fetching Notes:', err);
        res.status(500).json({ description: 'Error fetching Notes' });
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
//         res.status(500).json({ description: 'Error creating Notes' });
//     }
// };
