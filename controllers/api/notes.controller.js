const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const Notes = require('../../models/Notes');
const { Course, Branch } = require('../../models/CourseBranch.js');
const Subject = require('../../models/Subjects');
const Client = require('../../models/Client.js');
const Transaction = require('../../models/Transaction.js');
const s3 = require('../../config/s3.js');
const { errorHandler } = require('../../utils/error.js');

const generateUniqueSlug = async (title, username) => {
    let baseSlug = `${title
        .replace(/\s+/g, '-')
        .toLowerCase()}-${username.toLowerCase()}`;
    let uniqueSlug = baseSlug;

    let count = 0;
    while (await Notes.findOne({ slug: uniqueSlug })) {
        count++;
        uniqueSlug = `${baseSlug}-${count}`;
    }

    return uniqueSlug;
};

module.exports.fetchNotesByCollege = async (req, res) => {
    const { subjectCode, branchCode, collegeId } = req.params;

    const branch = await Branch.findOne({
        branchCode: { $regex: new RegExp(`^${branchCode}$`, 'i') },
    });

    if (!branch) {
        return res.status(404).json({ message: 'Branch not found' });
    }

    const subject = await Subject.findOneAndUpdate(
        {
            subjectCode: { $regex: new RegExp(`^${subjectCode}$`, 'i') },
            branch: branch._id,
        },
        { $inc: { clickCounts: 1 } },
        { new: true }
    );

    if (!subject) {
        return res.status(404).json({ message: 'Subject not found' });
    }

    const notes = await Notes.find({
        subject: subject._id,
        college: collegeId,
        status: true,
    })
        .populate('subject', 'subjectName subjectCode')
        .populate('owner', 'username profilePicture');

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
        return next(errorHandler(403, 'Subject not found'));
    }

    let subjectId = subject._id;

    let owner = req.user.id;

    const user = await Client.findById(owner);
    const slug = await generateUniqueSlug(title, user.username);

    const newNotes = new Notes({
        subject: subjectId,
        title,
        description,
        owner,
        slug,
        fileUrl,
        college,
    });

    await Subject.findByIdAndUpdate(subjectId, { $inc: { totalNotes: 1 } });

    await Branch.findByIdAndUpdate(branch._id, { $inc: { totalNotes: 1 } });

    await Course.findByIdAndUpdate(branch.course, { $inc: { totalNotes: 1 } });

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

    const { fileUrl, subject, owner, rewardPoints } = note;

    const bucketName = process.env.S3_BUCKET_NAME;
    const region = process.env.AWS_REGION;
    const s3Key = fileUrl.replace(
        `https://${bucketName}.s3.${region}.amazonaws.com/`,
        ''
    );

    await s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key }));

    const newSubject = await Subject.findByIdAndUpdate(
        subject,
        { $inc: { totalNotes: -1 } },
        { new: true }
    );

    const branch = await Branch.findByIdAndUpdate(
        newSubject.branch,
        { $inc: { totalNotes: -1 } },
        { new: true }
    );
    if (branch) {
        await Course.findByIdAndUpdate(branch.course, {
            $inc: { totalNotes: -1 },
        });
    }

    if (owner && rewardPoints > 0) {
        const client = await Client.findById(owner);
        if (client) {
            client.rewardPoints -= rewardPoints;
            client.rewardBalance -= rewardPoints;

            await client.save();

            const transaction = new Transaction({
                user: client._id,
                type: 'reduction',
                points: rewardPoints,
                resourceType: 'notes',
                resourceId: note._id,
            });

            await transaction.save();
        }
    }

    // Delete the note
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

module.exports.getNote = async (req, res, next) => {
    const note = await Notes.findOneAndUpdate(
        { slug: req.params.slug, status: true },
        { $inc: { clickCounts: 1 } },
        { new: true }
    )
        .populate('subject', 'subjectName subjectCode')
        .populate('owner', 'username profilePicture');

    if (!note) {
        return next(errorHandler(403, 'Note not found'));
    }

    res.json({ note });
};
