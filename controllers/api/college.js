const Colleges = require('../../models/Colleges');

module.exports.fetchCollege = async (req, res) => {
    try {
        const allColleges = await Colleges.find({ status: true });
        res.json(allColleges);
    } catch (err) {
        console.error('Error fetching colleges:', err);
        res.json({ description: 'Error fetching colleges' });
    }
};

module.exports.createCollege = async (req, res) => {
    const { name, location, description } = req.body;
    const newCollege = new Colleges({
        name,
        location,
        description,
        owner: '66ca376e67648a43129603b1',
    });
    await newCollege.save();
    res.json({
        description: 'College submitted successfully and is pending approval.',
    });
};
