const Store = require('../../models/Store.js');
const { cloudinary } = require('../../cloudConfig.js');
const jwt = require('jsonwebtoken');
const Affiliate = require('../../models/AffiliateProduct.js');
const { errorHandler } = require('../../utils/error.js');

module.exports = {
    fetchProducts: async (req, res) => {
        const store = await Store.find({ status: true });
        res.json(store);
    },

    fetchProductByCollege: async (req, res) => {
        const { collegeId } = req.params;
        const store = await Store.find({
            status: true,
            college: collegeId,
        }).sort({ available: -1 });

        return res.status(200).json(store);
    },

    fetchSuggestedProducts: async (req, res) => {
        const { collegeId, slug } = req.params;

        const suggestedProducts = await Store.find({
            status: true,
            available: true,
            college: collegeId,
            slug: { $ne: slug },
        })
            .populate('college')
            .limit(5)
            .sort({ createdAt: -1 });

        res.json(suggestedProducts);
    },

    // fetchProductById: async (req, res) => {
    //
    //         const { id } = req.params;
    //         const product = await Store.findOne({ _id: id, status: true });
    //         if (!product) {
    //                return next(errorHandler( 404, 'Product not found or inactive' ));
    //         }
    //         await Store.findByIdAndUpdate(id, { $inc: { clickCount: 1 } });
    //         res.json(product);
    //
    // },

    fetchPyqBySlug: async (req, res) => {
        const { slug } = req.params;

        const product = await Store.findOneAndUpdate(
            { slug: slug, status: true },
            { $inc: { clickCount: 1 } },
            { new: true }
        );
        if (!product) {
            return next(errorHandler(404, 'Product not found or inactive'));
        }

        res.status(200).json(product);
    },

    createProduct: async (req, res) => {
        let url, filename;
        if (req.file) {
            url = req.file.path;
            filename = req.file.filename;
        } else {
            return res.status(400).json({ message: 'Image is required' });
        }

        const {
            name,
            price,
            description,
            whatsapp,
            telegram,
            college,
            available,
        } = req.body;

        let owner = req.user.id;

        const createSlug = (name) => {
            return `${name}`
                .toLowerCase()
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
        };

        let slug = createSlug(name);
        let existingProduct = await Store.findOne({ slug });
        let counter = 1;

        while (existingProduct) {
            slug = `${createSlug(name)}-${counter}`;
            existingProduct = await Store.findOne({ slug });
            counter++;
        }

        const newProduct = new Store({
            name,
            price,
            description,
            whatsapp,
            telegram,
            owner,
            college,
            slug,
            available: available === 'true',
            image: { url, filename },
        });

        await newProduct.save();
        res.status(201).json({
            message: 'Product Created Successfully, Available Once Approved',
        });
    },

    updateProduct: async (req, res) => {
        const { id } = req.params;
        const {
            name,
            description,
            price,
            whatsapp,
            telegram,
            college,
            available,
            status = true,
        } = req.body;

        const updatedProduct = await Store.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price,
                whatsapp,
                telegram,
                college,
                status,
                available: available === 'true',
            },
            { new: true }
        );

        if (!updatedProduct) {
            return next(errorHandler(404, 'Product not found or inactive'));
        }

        if (req.file) {
            if (updatedProduct.image && updatedProduct.image.filename) {
                await cloudinary.uploader.destroy(
                    updatedProduct.image.filename
                );
            }

            const url = req.file.path;
            const filename = req.file.filename;

            updatedProduct.image = { url, filename };
        }

        await updatedProduct.save();

        res.status(200).json({
            message: 'Product updated successfully',
            updatedProduct,
        });
    },

    deleteProduct: async (req, res) => {
        const product = await Store.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product && product.image && product.image.filename) {
            await cloudinary.uploader.destroy(product.image.filename);
        }

        await Store.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: 'Product deleted successfully',
        });
    },

    fetchAffiliateProducts: async (req, res) => {
        const affiliateProduct = await Affiliate.find({});
        res.json(affiliateProduct);
    },
};
