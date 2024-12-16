const Seniors = require('../../models/Senior');
const jwt = require('jsonwebtoken');

module.exports.fetchSenior = async (req, res) => {
    try {
        const seniors = await Seniors.find({ status: true });
        res.json(seniors);
    } catch (err) {
        console.error('Error fetching Seniors:', err);
        res.status(500).json({ message: 'Error fetching Seniors' });
    }
};

module.exports.fetchSeniorByCollege = async (req, res) => {
    try {
        const { collegeId } = req.params;
        const seniors = await Seniors.find({
            status: true,
            college: collegeId,
        })
            .populate('owner', 'profilePicture')
            .sort({ priority: 1 });
        res.json(seniors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Seniors' });
    }
};

// module.exports.fetchSeniorById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const senior = await Seniors.findOne({
//             status: true,
//             _id: id,
//         }).populate('owner', 'profilePicture');
//         if (!senior) {
//             return res.status(404).json({ message: 'Senior not found' });
//         }
//         await Seniors.findByIdAndUpdate(id, { $inc: { clickCount: 1 } });
//         res.json(senior);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching Senior' });
//     }
// };

module.exports.fetchSeniorBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        const senior = await Seniors.findOneAndUpdate(
            { slug: slug, status: true },
            { $inc: { clickCount: 1 } },
            { new: true }
        ).populate('owner', 'profilePicture');

        if (!senior) {
            return res.status(404).json({ message: 'Senior not found' });
        }

        res.json(senior);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Senior' });
    }
};

module.exports.createSenior = async (req, res) => {
    const createSlug = (name) => {
        return `${name}`
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    const { name, domain, branch, year, whatsapp, telegram, college, status } =
        req.body;

    try {
        let owner = req.user.id;

        let slug = createSlug(name);

        let existingSenior = await Seniors.findOne({ slug });

        let counter = 1;

        while (existingSenior) {
            slug = `${createSlug(name)}-${counter}`;
            existingSenior = await Seniors.findOne({ slug });
            counter++;
        }

        const newSenior = new Seniors({
            name,
            domain,
            branch,
            whatsapp,
            telegram,
            year,
            college,
            slug,
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
        res.status(500).json({ message: 'Error creating Senior' });
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
            return res.status(404).json({ message: 'Senior not found' });
        }

        if (updatedSenior.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'You are not authorized to Update this Senior',
            });
        }

        res.json({
            description: 'Senior updated successfully',
            updatedSenior,
        });
    } catch (err) {
        console.error('Error updating Senior:', err);
        res.status(500).json({ message: 'Error updating Senior' });
    }
};

module.exports.deleteSenior = async (req, res) => {
    try {
        const senior = await Seniors.findById(req.params.id);
        if (!senior) {
            return res.status(404).json({ message: 'Senior not found' });
        }

        if (senior.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'You are not authorized to delete this Senior',
            });
        }

        await Seniors.findByIdAndDelete(req.params.id);

        res.status(200).json({
            description: 'Senior has been deleted successfully',
        });
    } catch (err) {
        console.error('Error deleting Senior:', err);
        res.status(500).json({ message: 'Error deleting Senior' });
    }
};
