const PYQ = require('../../models/PYQ');

// Fetch all PYQs with status true
module.exports.fetchPyq = async (req, res) => {
    try {
        const pyqs = await PYQ.find({ status: true });
        res.json(pyqs);
    } catch (err) {
        console.error('Error fetching PYQs:', err);
        res.status(500).json({ description: 'Error fetching PYQs' });
    }
};

// Create a new PYQ
// module.exports.createPyq = async (req, res) => {
//     const {
//         subjectName,
//         subjectCode,
//         semester,
//         year,
//         branch,
//         course,
//         examType,
//         link,
//         college,
//     } = req.body;

//     try {
//         const newPYQ = new PYQ({
//             subjectName,
//             subjectCode,
//             semester,
//             year,
//             branch,
//             course,
//             examType,
//             link,
//             college,
//         });

//         await newPYQ.save();

//         res.json({
//             description: 'PYQ submitted successfully and is pending approval.',
//         });
//     } catch (err) {
//         console.error('Error creating PYQ:', err);
//         res.status(500).json({ description: 'Error creating PYQ' });
//     }
// };
