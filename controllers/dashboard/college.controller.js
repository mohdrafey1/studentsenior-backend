const Colleges = require('../../models/Colleges');

module.exports.index = async (req, res) => {
    const allColleges = await Colleges.find({});
    res.render('colleges/colleges', { allColleges });
};

module.exports.collegeForm = (req, res) => {
    res.render('colleges/new.ejs');
};

module.exports.showCollege = async (req, res) => {
    let { id } = req.params;
    const college = await Colleges.findById(id)
        .populate('owner')
        .populate('client');

    if (!college) {
        req.flash('error', 'College You requested for does not exist');
        return res.redirect('/colleges');
    }
    // console.log(college);

    res.render('colleges/show.ejs', { college });
};

module.exports.createCollege = async (req, res) => {
    // console.log(req.body);

    const { name, description, location, status } = req.body;

    const newCollege = new Colleges({
        name,
        description,
        location,
        status,
    });
    newCollege.owner = req.user._id;
    await newCollege.save();
    req.flash('success', 'New College Added Successfully');
    res.redirect('/colleges');
};

module.exports.editCollegeForm = async (req, res) => {
    let { id } = req.params;
    const college = await Colleges.findById(id);
    if (!college) {
        req.flash('error', 'College You requested for does not exist');
        return res.redirect('/colleges');
    }
    res.render('colleges/edit.ejs', { college });
};

module.exports.editCollege = async (req, res) => {
    let { id } = req.params;
    const { name, description, location, status } = req.body;
    const updatedCollege = {
        name,
        description,
        location,
        status,
    };
    await Colleges.findByIdAndUpdate(id, updatedCollege, { new: true });
    req.flash('success', 'Updated Successfully');
    res.redirect(`/colleges/${id}`);
};

module.exports.deleteCollege = async (req, res) => {
    let { id } = req.params;
    await Colleges.findByIdAndDelete(id);
    req.flash('success', 'Delete Successfully');
    // console.log(deleteCollege);
    res.redirect('/colleges');
};
