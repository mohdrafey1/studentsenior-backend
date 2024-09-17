const Seniors = require('../../models/Senior');
const jwt = require('jsonwebtoken');

module.exports.fetchSenior = async (req, res) => {
    try {
        const seniors = await Seniors.find({ status: true });
        res.json(seniors);
    } catch (err) {
        console.error('Error fetching Seniors:', err);
        res.status(500).json({ description: 'Error fetching Seniors' });
    }
};

module.exports.createSenior = async (req, res) => {
    const { name, domain, branch, year, whatsapp, telegram, college, status } =
        req.body;

    try {
        const token = req.cookies.access_token; // Get the token from cookies or authorization header
        let owner;

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify and decode the token
            owner = decoded.id; // Assign the user ID as the owner
        } else {
            return res
                .status(403)
                .json({ description: 'Access denied. No token provided.' });
        }

        const newSenior = new Seniors({
            name,
            domain,
            branch,
            whatsapp,
            telegram,
            year,
            college,
            status,
            owner,
        });

        await newSenior.save();

        res.json({
            description:
                'Senior submitted successfully and is pending approval.',
        });
    } catch (err) {
        console.error('Error creating Senior:', err);
        res.status(500).json({ description: 'Error creating Senior' });
    }
};

module.exports.updateSenior = async (req, res) => {
    const { id } = req.params;
    const { name, domain, branch, year, whatsapp, telegram, college } =
        req.body;

    try {
        const updatedSenior = await Seniors.findByIdAndUpdate(
            id,
            {
                name,
                domain,
                branch,
                year,
                whatsapp,
                telegram,
                college,
            },
            { new: true }
        );

        if (!updatedSenior) {
            return res.status(404).json({ description: 'Senior not found' });
        }

        res.json({
            description: 'Senior updated successfully',
            updatedSenior,
        });
    } catch (err) {
        console.error('Error updating Senior:', err);
        res.status(500).json({ description: 'Error updating Senior' });
    }
};

module.exports.deleteSenior = async (req, res, next) => {
    try {
        const senior = await Seniors.findByIdAndDelete(req.params.id);

        if (!senior) {
            return res.status(404).json({ description: 'Senior not found' });
        }

        res.status(200).json('Senior has been deleted...');
    } catch (error) {
        console.error('Error deleting Senior:', error);
        res.status(500).json({ description: 'Error deleting Senior' });
    }
};
