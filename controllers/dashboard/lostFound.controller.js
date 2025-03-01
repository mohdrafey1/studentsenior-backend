const LostFound = require('../../models/LostFound');
const College = require('../../models/Colleges');
const { errorHandler } = require('../../utils/error');
const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../../config/s3');

// Fetch all Lost & Found items (Dashboard View)
module.exports.getLostFoundItems = async (req, res) => {
    const { search, type, college } = req.query;
    const perPage = 30;
    const page = parseInt(req.query.page) || 1;

    // Build query dynamically
    const query = {};
    if (type) query.type = type;
    if (college) query.college = college;
    if (search) query.name = { $regex: search, $options: 'i' };

    const totalItems = await LostFound.countDocuments(query);
    const items = await LostFound.find(query)
        .populate('owner', 'username')
        .populate('college', 'name')
        .sort({ createdAt: -1 })
        .skip(perPage * (page - 1))
        .limit(perPage);

    const colleges = await College.find({});

    res.render('lostfound/index.ejs', {
        items,
        colleges,
        selectedCollege: college || '',
        search: search || '',
        selectedType: type || '',
        currentPage: page,
        totalPages: Math.ceil(totalItems / perPage),
    });
};

// Show form to edit Lost & Found item
module.exports.editLostFoundForm = async (req, res) => {
    const { id } = req.params;
    const item = await LostFound.findById(id).populate('college');

    if (!item) {
        req.flash('error', 'Item not found');
        return res.redirect('/lostfound');
    }

    const colleges = await College.find({});
    res.render('lostFound/edit.ejs', { item, colleges });
};

// Edit Lost & Found item
module.exports.editLostFoundItem = async (req, res) => {
    const { id } = req.params;
    const {
        name,
        description,
        type,
        location,
        whatsapp,
        currentStatus,
        status,
    } = req.body;

    try {
        const updatedItem = await LostFound.findByIdAndUpdate(
            id,
            {
                name,
                description,
                type,
                location,
                whatsapp,
                currentStatus,
                status,
            },
            { new: true }
        );

        if (!updatedItem) {
            req.flash('error', 'Item not found');
            return res.redirect('/lostfound');
        }

        req.flash('success', 'Item updated successfully');
        res.redirect('/lostfound');
    } catch (error) {
        req.flash('error', 'Error updating item');
        console.log(error);

        res.redirect('/lostfound');
    }
};

// Delete Lost & Found item
module.exports.deleteLostFoundItem = async (req, res) => {
    const { id } = req.params;

    try {
        const item = await LostFound.findById(id);
        if (!item) {
            req.flash('error', 'Item not found');
            return res.redirect('/lostfound');
        }

        // Extract S3 details
        if (item.imageUrl) {
            const bucketName = process.env.S3_BUCKET_NAME;
            const region = process.env.AWS_REGION;
            const s3Key = item.imageUrl.replace(
                `https://${bucketName}.s3.${region}.amazonaws.com/`,
                ''
            );

            // Delete the image from S3
            try {
                await s3.send(
                    new DeleteObjectCommand({ Bucket: bucketName, Key: s3Key })
                );
            } catch (err) {
                console.error('Error deleting image from S3:', err);
                req.flash('error', 'Failed to delete image from storage');
                return res.redirect('/lostfound');
            }
        }

        // Delete the item from the database
        await LostFound.findByIdAndDelete(id);

        req.flash('success', 'Item deleted successfully');
        res.redirect('/lostfound');
    } catch (error) {
        console.error('Error deleting item:', error);
        req.flash('error', 'Error deleting item');
        res.redirect('/lostfound');
    }
};
