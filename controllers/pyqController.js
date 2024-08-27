const Colleges = require('../models/Colleges');
const PYQ = require('../models/PYQ');

// Index - List all approved PYQs for a specific college
exports.index = async (req, res) => {
    const perPage = 10;
    const page = parseInt(req.query.page) || 1;

    try {
        const totalPYQs = await PYQ.countDocuments({});
        const pyqs = await PYQ.find({})
            .populate('college')
            .sort({ createdAt: -1 }) // Newest first
            .skip(perPage * page - perPage)
            .limit(perPage);

        res.render('pyqs/index', {
            pyqs: pyqs,
            currentPage: page,
            totalPages: Math.ceil(totalPYQs / perPage),
        });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
};

// Show form to add new PYQ
exports.new = (req, res) => {
    console.log('Rendering new PYQ form');
    res.render('pyqs/new');
};

// Create - Add new PYQ
exports.create = async (req, res) => {
    try {
        const {
            subjectName,
            subjectCode,
            semester,
            year,
            branch,
            course,
            examType,
            link,
            college,
            status,
        } = req.body;

        const branchArray = branch.split(',').map((b) => b.trim());

        const newPYQ = new PYQ({
            subjectName,
            subjectCode,
            semester,
            year,
            branch: branchArray,
            course,
            examType,
            link,
            college,
            status,
        });
        await newPYQ.save();

        req.flash('success', 'PYQ Created Successfully');
        return res.redirect(`/pyqs`);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

module.exports.show = async (req, res) => {
    const { id } = req.params;
    const pyq = await PYQ.findById(id).populate('college');
    if (!pyq) {
        req.flash('error', 'PYQ not found!');
        return res.redirect(`/pyqs`);
    }
    res.render('pyqs/show', { pyq });
};

// Edit - Show form to edit a PYQ
module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const pyq = await PYQ.findById(id);
    if (!pyq) {
        req.flash('error', 'PYQ not found!');
        return res.redirect(`/pyqs`);
    }
    res.render('pyqs/edit', { pyq });
};

// edit
module.exports.editPyq = async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(id);

        const updatedPYQ = await PYQ.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        if (!updatedPYQ) {
            req.flash('error', 'PYQ not found');
            return res.redirect('/pyqs');
        }

        req.flash('success', 'Updated Successfully');
        res.redirect(`/pyqs/${id}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error updating PYQ');
        res.redirect(`/pyqs/${id}/edit`);
    }
};

// Delete - Remove a PYQ
exports.delete = async (req, res) => {
    await PYQ.findByIdAndDelete(req.params.id);
    res.redirect(`/pyqs`);
};
