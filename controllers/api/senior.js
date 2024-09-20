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
        let owner = req.user.id;

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
    // console.log(req.body);

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

        if (updatedSenior.owner.toString() !== req.user.id) {
            return res.status(403).json({
                description: 'You are not authorized to Update this Senior',
            });
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

module.exports.deleteSenior = async (req, res) => {
    try {
        const senior = await Seniors.findById(req.params.id);
        if (!senior) {
            return res.status(404).json({ description: 'Senior not found' });
        }

        if (senior.owner.toString() !== req.user.id) {
            return res.status(403).json({
                description: 'You are not authorized to delete this Senior',
            });
        }

        await Seniors.findByIdAndDelete(req.params.id);

        res.status(200).json({
            description: 'Senior has been deleted successfully',
        });
    } catch (err) {
        console.error('Error deleting Senior:', err);
        res.status(500).json({ description: 'Error deleting Senior' });
    }
};
