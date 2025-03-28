const Colleges = require('../../models/Colleges');
const { errorHandler } = require('../../utils/error');

// Get all colleges
module.exports.index = async (req, res) => {
    const allColleges = await Colleges.find({});
    res.status(200).json(allColleges);
};

// Get a single college by ID
module.exports.showCollege = async (req, res) => {
    const { slug } = req.params;
    const college = await Colleges.findOne({ slug: slug })
        .populate('owner')
        .populate('client');

    if (!college) {
        return next(errorHandler(403, 'College not found'));
    }

    res.status(200).json(college);
};

// Create a new college
module.exports.createCollege = async (req, res, next) => {
    const { name, description, location, status } = req.body;
    const slug = name.replace(/\s+/g, '-').toLowerCase();

    const existingCollege = await Colleges.findOne({ slug });
    if (existingCollege) {
        return next(
            errorHandler(400, 'College with this name already exists.')
        );
    }

    const newCollege = new Colleges({
        name,
        description,
        location,
        status,
        slug,
        owner: req.user._id,
    });

    await newCollege.save();
    res.status(201).json({
        message: 'College created successfully',
        college: newCollege,
    });
};

// Update college details
module.exports.editCollege = async (req, res) => {
    const { id } = req.params;
    const { name, description, location, status, slug } = req.body;

    const updatedCollege = await Colleges.findByIdAndUpdate(
        id,
        { name, description, location, status, slug },
        { new: true }
    );

    if (!updatedCollege) {
        return res.status(404).json({ message: 'College not found' });
    }

    res.status(200).json({
        message: 'College updated successfully',
        college: updatedCollege,
    });
};

// Delete a college
module.exports.deleteCollege = async (req, res) => {
    const { id } = req.params;
    const deletedCollege = await Colleges.findByIdAndDelete(id);

    if (!deletedCollege) {
        return res.status(404).json({ message: 'College not found' });
    }

    res.status(200).json({ message: 'College deleted successfully' });
};
