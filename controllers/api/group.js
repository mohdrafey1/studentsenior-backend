const Groups = require('../../models/WhatsappGroup');

// Fetch all PYQs with status true
module.exports.fetchGroups = async (req, res) => {
    try {
        const groups = await Groups.find({ status: true });
        res.json(groups);
    } catch (err) {
        console.error('Error fetching Groups:', err);
        res.status(500).json({ description: 'Error fetching Groups' });
    }
};

module.exports.createGroup = async (req, res) => {
    const { title, domain, info, link, college } = req.body;

    try {
        const newGroup = new Groups({
            title,
            domain,
            info,
            link,
            college,
        });

        await newGroup.save();

        res.json({
            description:
                'Group submitted successfully and is pending approval.',
        });
    } catch (err) {
        console.error('Error creating Group:', err);
        res.status(500).json({ description: 'Error creating Group' });
    }
};
