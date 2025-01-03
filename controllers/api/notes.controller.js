const { PutObjectCommand } = require('@aws-sdk/client-s3');
const Notes = require('../../models/Notes');
const Subject = require('../../models/Subjects');
const Client = require('../../models/Client.js');
const s3 = require('../../config/s3.js');
const { errorHandler } = require('../../utils/error.js');

// Create a new Notes
module.exports.createNotes = async (req, res, next) => {
    const { subject, description, title, college, owner } = req.body;
    const file = req.file;

    console.log(file);

    console.log(req.body);

    if (!file) {
        return next(errorHandler(401, 'No file uploaded'));
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

    console.log(uploadResult);

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
