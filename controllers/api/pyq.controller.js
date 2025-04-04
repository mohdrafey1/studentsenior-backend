const PYQ = require('../../models/PYQ');
const PyqRequest = require('../../models/PyqRequest');
const { errorHandler } = require('../../utils/error');

// Fetch all PYQs with status true
module.exports.fetchPyq = async (req, res) => {
    const pyqs = await PYQ.find({ status: true });
    res.json(pyqs);
};

module.exports.fetchPyqByCollege = async (req, res) => {
    const { collegeId } = req.params;
    const pyqs = await PYQ.find({ status: true, college: collegeId }).sort({
        createdAt: -1,
    });

    return res.status(200).json(pyqs);
};

module.exports.fetchPyqBySlug = async (req, res) => {
    const { slug } = req.params;

    const pyq = await PYQ.findOneAndUpdate(
        { slug: slug, status: true },
        { $inc: { clickCount: 1 } },
        { new: true }
    );

    if (!pyq) {
        return next(errorHandler(404, 'PYQ not found'));
    }

    res.status(200).json(pyq);
};

module.exports.requestPyq = async (req, res) => {
    const {
        subject,
        semester,
        year,
        branch,
        examType,
        college,
        description,
        whatsapp,
    } = req.body;

    const newRequest = new PyqRequest({
        subject,
        semester,
        year,
        branch,
        examType,
        college,
        description,
        whatsapp,
    });
    await newRequest.save();

    res.status(201).json({
        message: 'Request sent successfull , we will provide you pyq soon',
    });
};

// module.exports.fetchPyqById = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const pyq = await PYQ.findOne({ _id: id, status: true });
//         if (!pyq) {
//             return res.status(404).json({ message: 'Pyq not found' });
//         }
//         await PYQ.findByIdAndUpdate(id, { $inc: { clickCount: 1 } });

//         res.status(200).json(pyq);
//     } catch (e) {
//         console.error(e);
//         res.status(500).json({ message: 'Some error occurred on the server' });
//     }
// };

//fetch related papers
// module.exports.fetchRelatedPapers = async (req, res) => {
//     const { collegeId, pyqId } = req.params;
//     const { year, semester, course, branch, examType } = req.query;

//     const query = { status: true, college: collegeId };

//     if (year) query.year = year;
//     if (semester) query.semester = semester;
//     if (course) query.course = course;
//     if (examType) query.examType = examType;

//     if (branch) {
//         const branches = branch.split(',').map((b) => b.trim());
//         query.branch = { $in: branches };
//     }

//     if (pyqId) {
//         query._id = { $ne: pyqId };
//     }

//     const relatedPapers = await PYQ.find(query).limit(6);
//     res.json(relatedPapers);
// };

// module.exports.fetchPyqBundle = async (req, res) => {
//     const { collegeId } = req.params;
//     const { year, semester, course, branch, examType } = req.query;

//     const query = {
//         status: true,
//         college: collegeId,
//     };

//     if (year) query.year = year;
//     if (semester) query.semester = semester;
//     if (course) query.course = course;
//     if (examType) query.examType = examType;

//     if (branch) {
//         const branches = branch.split(',').map((b) => b.trim());
//         query.branch = { $in: branches };
//     }

//     const bundlePyq = await PYQ.find(query);
//     res.json(bundlePyq);
// };
