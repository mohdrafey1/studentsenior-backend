const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const Notes = require('../../models/Notes');
const { Branch } = require('../../models/CourseBranch.js');
const Subject = require('../../models/Subjects');
const Client = require('../../models/Client.js');
const s3 = require('../../config/s3.js');
const { errorHandler } = require('../../utils/error.js');

module.exports.fetchNotesByCollege = async (req, res) => {
    const { subjectCode, branchCode, collegeId } = req.params;

    const branch = await Branch.findOne({
        branchCode: { $regex: new RegExp(`^${branchCode}$`, 'i') },
    });

    if (!branch) {
        return res.status(404).json({ message: 'Branch not found' });
    }

    const subject = await Subject.findOne({
        subjectCode: { $regex: new RegExp(`^${subjectCode}$`, 'i') },
        branch: branch._id,
    });

    if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
    }

    const notes = await Notes.find({
        subject: subject._id,
        college: collegeId,
        status: true,
    })
        .populate('subject', 'subjectName subjectCode')
        .populate('owner', 'username');

    res.status(200).json(notes);
};

// Create a new Notes
module.exports.createNotes = async (req, res, next) => {
    const { subjectCode, branchCode, description, title, college, fileUrl } =
        req.body;

    if (!fileUrl) {
        return next(errorHandler(404, 'No file uploaded'));
    }

    const branch = await Branch.findOne({
        branchCode: { $regex: new RegExp(`^${branchCode}$`, 'i') },
    });

    if (!branch) {
        return res.status(404).json({ message: 'Branch not found' });
    }

    const subject = await Subject.findOne({
        subjectCode: { $regex: new RegExp(`^${subjectCode}$`, 'i') },
        branch: branch._id,
    });

    if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
    }

    let subjectId = subject._id;

    let owner = req.user.id;

    const user = await Client.findById(owner);
    const slug = (title.replace(/\s+/g, '-') + '-' + user.username).toString();

    const newNotes = new Notes({
        subject: subjectId,
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
        message:
            'Notes submitted successfully and is pending approval , Once Approved you will get your reward.',
    });
};

module.exports.deleteNote = async (req, res, next) => {
    const { id } = req.params;

    const note = await Notes.findById(id);

    if (!note) {
        return next(errorHandler(404, 'Note not found'));
    }

    const { fileUrl, subject } = note;

    const bucketName = process.env.S3_BUCKET_NAME;
    const region = process.env.AWS_REGION;
    const s3Key = fileUrl.replace(
        `https://${bucketName}.s3.${region}.amazonaws.com/`,
        ''
    );

    await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key }));

    if (subject) {
        const subjectNotesCount = await Subject.findById(subject);
        if (subjectNotesCount) {
            subjectNotesCount.totalNotes -= 1;
            await subjectNotesCount.save();
        }
    }

    await Notes.deleteOne({ _id: id });

    res.json({ message: 'Note deleted successfully' });
};

module.exports.likeNote = async (req, res) => {
    const userId = req.user.id;
    const noteId = req.params.id;

    const note = await Notes.findById(noteId);
    if (!note) {
        return next(errorHandler(404, 'note not found'));
    }

    const hasLiked = note.likes.includes(userId);

    if (hasLiked) {
        note.likes = note.likes.filter(
            (id) => id.toString() !== userId.toString()
        );
        await note.save();
        return res.json({
            message: 'note unliked!',
            likes: note.likes.length,
        });
    } else {
        note.likes.push(userId);
        await note.save();
        return res.json({
            message: 'note liked!',
            likes: note.likes.length,
        });
    }
};
