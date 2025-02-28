const LostFound = require('../../models/LostFound');
const Client = require('../../models/Client');
const { errorHandler } = require('../../utils/error');

// Create Lost or Found Item
module.exports.createItem = async (req, res, next) => {
    try {
        const {
            name,
            description,
            type,
            location,
            imageUrl,
            whatsapp,
            college,
        } = req.body;

        console.log(req.body);

        let owner = req.user.id;
        const user = await Client.findById(owner);
        const slug = (name.trim() + '-' + user.username)
            .replace(/\s+/g, '-')
            .toLowerCase();
        let currentStatus = 'pending';

        const existingItem = await LostFound.findOne({ slug: slug });

        if (existingItem) {
            return next(errorHandler(403, 'This Item is Already Added '));
        }

        const newItem = new LostFound({
            name,
            description,
            type,
            owner,
            location,
            slug,
            imageUrl,
            currentStatus,
            whatsapp,
            college,
        });
        await newItem.save();
        res.status(201).json({
            message: 'Item created successfully',
            item: newItem,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all Lost & Found items
module.exports.getAllItems = async (req, res) => {
    try {
        const items = await LostFound.find({ status: true }).populate(
            'owner',
            'username'
        );
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single Lost & Found item by slug
module.exports.getItemBySlug = async (req, res) => {
    try {
        const item = await LostFound.findOne({
            slug: req.params.slug,
        }).populate('owner', 'username');
        if (!item) return res.status(404).json({ message: 'Item not found' });

        item.clickCounts += 1;
        await item.save();

        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Lost & Found item
module.exports.updateItem = async (req, res) => {
    try {
        const { name, description, currentStatus, location } = req.body;
        const updatedItem = await LostFound.findOneAndUpdate(
            { slug: req.params.slug },
            { name, description, currentStatus, location },
            { new: true }
        );
        if (!updatedItem)
            return res.status(404).json({ message: 'Item not found' });

        res.status(200).json({
            message: 'Item updated successfully',
            item: updatedItem,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Lost & Found item
module.exports.deleteItem = async (req, res) => {
    try {
        const deletedItem = await LostFound.findOneAndDelete({
            slug: req.params.slug,
        });
        if (!deletedItem)
            return res.status(404).json({ message: 'Item not found' });

        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
