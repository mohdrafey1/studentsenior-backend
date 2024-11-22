const PYQ = require('../../models/PYQ');

// Fetch all PYQs with status true
module.exports.fetchPyq = async (req, res) => {
    try {
        const pyqs = await PYQ.find({ status: true });
        res.json(pyqs);
    } catch (err) {
        console.error('Error fetching PYQs:', err);
        res.status(500).json({ message: 'Error fetching PYQs' });
    }
};

module.exports.fetchPyqByCollege = async (req, res) => {
    try {
        const { collegeId } = req.params;
        const pyqs = await PYQ.find({ status: true, college: collegeId }).sort({
            createdAt: -1,
        });

        return res.status(200).json(pyqs);
    } catch (err) {
        console.error('Error fetching PYQs:', err);
        return res
            .status(500)
            .json({ message: 'Some error occurred on the server' });
    }
};

module.exports.fetchPyqById = async (req, res) => {
    const { id } = req.params;
    try {
        const pyq = await PYQ.findOne({ _id: id, status: true });
        if (!pyq) {
            return res.status(404).json({ message: 'Pyq not found' });
        }
        await PYQ.findByIdAndUpdate(id, { $inc: { clickCount: 1 } });
        console.log(pyq);

        res.status(200).json(pyq);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Some error occurred on the server' });
    }
};

//fetch related papers
module.exports.fetchRelatedPapers = async (req, res) => {
    const { collegeId, pyqId } = req.params;
    const { year, semester, course, branch, examType } = req.query;

    const query = { status: true, college: collegeId };

    if (year) query.year = year;
    if (semester) query.semester = semester;
    if (course) query.course = course;
    if (examType) query.examType = examType;

    if (branch) {
        const branches = branch.split(',').map((b) => b.trim());
        query.branch = { $in: branches };
    }

    if (pyqId) {
        query._id = { $ne: pyqId };
    }

    try {
        const relatedPapers = await PYQ.find(query).limit(6);
        res.json(relatedPapers);
    } catch (error) {
        res.status(500).send('Error fetching related papers');
        console.log(error);
    }
};

module.exports.fetchPyqBundle = async (req, res) => {
    const { collegeId } = req.params;
    const { year, semester, course, branch, examType } = req.query;

    const query = {
        status: true,
        college: collegeId,
    };

    if (year) query.year = year;
    if (semester) query.semester = semester;
    if (course) query.course = course;
    if (examType) query.examType = examType;

    if (branch) {
        const branches = branch.split(',').map((b) => b.trim());
        query.branch = { $in: branches };
    }

    try {
        const bundlePyq = await PYQ.find(query);
        res.json(bundlePyq);
    } catch (error) {
        res.status(500).send('Error fetching related papers');
        console.log(error);
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
//         res.status(500).json({ Message: 'Error creating PYQ' });
//     }
// };
