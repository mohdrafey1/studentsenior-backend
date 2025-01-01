const Subject = require('../models/Subjects');
const { Branch } = require('../models/CourseBranch.js');

module.exports.getSubjects = async (req, res) => {
    const allSubjects = await Subject.find({}).populate('branch');
    res.render('subjects/index.ejs', { allSubjects });
};

module.exports.addSubjectForm = async (req, res) => {
    const subject = await Subject.find();
    const branches = await Branch.find({});
    res.render('subjects/new.ejs', { subject, branches });
};

module.exports.addSubject = async (req, res) => {
    const { subjectName, subjectCode, branch } = req.body;

    const newSubject = new Subject({
        subjectCode,
        subjectName,
        branch,
    });

    if (branch) {
        const branchData = await Branch.findById(branch);
        if (branchData) {
            branchData.totalSubject += 1;
            await branchData.save();
        }
    }

    await newSubject.save();
    req.flash('success', 'New Subject Added Successfully');
    res.redirect('/subjects');
};

module.exports.editSubjectForm = async (req, res) => {
    const { id } = req.params;
    const subject = await Subject.findById(id).populate('branch');
    if (!subject) {
        req.flash('error', 'Subject Not Found');
        return res.redirect('/subjects');
    }
    res.render('subjects/edit.ejs', { subject });
};

module.exports.editSubject = async (req, res) => {
    const { id } = req.params;
    const { subjectName, subjectCode } = req.body;

    const updatedSubject = await Subject.findByIdAndUpdate(
        id,
        { subjectName, subjectCode },
        { new: true }
    );

    if (!updatedSubject) {
        req.flash('error', 'Subject not found');
        return res.redirect('/subjects');
    }

    req.flash('success', 'Subject updated successfully');
    res.redirect('/subjects');
};

module.exports.deleteSubject = async (req, res) => {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    if (subject) {
        const branch = await Branch.findById(subject.branch);
        if (branch) {
            branch.totalSubject -= 1;
            await branch.save();
        }
        await subject.deleteOne();
    }
    req.flash('success', 'Subject deleted successfully');
    res.redirect('/subjects');
};
