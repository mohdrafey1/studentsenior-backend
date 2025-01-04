const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const Notes = require('../../models/Notes');
const Subject = require('../../models/Subjects');
const Client = require('../../models/Client.js');
const s3 = require('../../config/s3.js');
const { errorHandler } = require('../../utils/error.js');

module.exports.fetchNotesByCollege = async (req, res) => {
    const { subjectId, collegeId } = req.params;

    const notes = await Notes.find({
        subject: subjectId,
        college: collegeId,
        status: true,
    })
        .populate('subject')
        .populate('owner', 'username');

    res.status(200).json(notes);
};

// Create a new Notes
module.exports.createNotes = async (req, res, next) => {
    const { subject, description, title, college } = req.body;
    const file = req.file;
    let owner = req.user.id;

    if (!file) {
        return next(errorHandler(404, 'No file uploaded'));
    }

    const fileName = `${title}-${Date.now()}.pdf`;
    const folderName = 'ss-notes/';

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${folderName}${fileName}`,
        Body: file.buffer,
        ContentType: 'application/pdf',
    };

    // Upload the file to S3
    const uploadResult = await s3.send(new PutObjectCommand(params));

    // Construct the file URL
    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${folderName}${fileName}`;

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
