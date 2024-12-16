const Store = require('../../models/Store.js');
const { cloudinary } = require('../../cloudConfig.js');
const jwt = require('jsonwebtoken');
const Affiliate = require('../../models/AffiliateProduct.js');

module.exports = {
    fetchProducts: async (req, res) => {
        try {
            const store = await Store.find({ status: true });
            res.json(store);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error fetching products' });
        }
    },

    fetchProductByCollege: async (req, res) => {
        try {
            const { collegeId } = req.params;
            const store = await Store.find({
                status: true,
                college: collegeId,
            }).sort({ available: -1 });

            return res.status(200).json(store);
        } catch (err) {
            return res
                .status(500)
                .json({ message: 'Some error occurred on the server' });
        }
    },

    fetchSuggestedProducts: async (req, res) => {
        const { collegeId, slug } = req.params;
        try {
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
        } catch (err) {
            res.status(500).json({
                message: 'Error fetching suggested products',
            });
        }
    },

    // fetchProductById: async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         const product = await Store.findOne({ _id: id, status: true });
    //         if (!product) {
    //             return res
    //                 .status(404)
    //                 .json({ message: 'Product not found or inactive' });
    //         }
    //         await Store.findByIdAndUpdate(id, { $inc: { clickCount: 1 } });
    //         res.json(product);
    //     } catch (err) {
    //         console.error(err);
    //         res.status(500).json({ message: 'Error fetching products' });
    //     }
    // },

    fetchPyqBySlug: async (req, res) => {
        const { slug } = req.params;
        try {
            const product = await Store.findOneAndUpdate(
                { slug: slug, status: true },
                { $inc: { clickCount: 1 } },
                { new: true }
            );
            if (!product) {
                return res
                    .status(404)
                    .json({ message: 'Product not found or inactive' });
            }

            res.status(200).json(product);
        } catch (e) {
            console.error(e);
            res.status(500).json({
                message: 'Some error occurred on the server',
            });
        }
    },

    createProduct: async (req, res) => {
        try {
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
                description: 'Product Created Successfully',
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ Message: 'Error creating product' });
        }
    },

    updateProduct: async (req, res) => {
        try {
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
                return res.status(404).json({ message: 'Product not found' });
            }

            if (updatedProduct.owner.toString() !== req.user.id) {
                return res.status(403).json({
                    message: 'You are not authorized to Update this product',
                });
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
                description: 'Product updated successfully',
                updatedProduct,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: `${err}` });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const product = await Store.findById(req.params.id);

            if (!product) {
                return res
                    .status(404)
                    .json({ description: 'Product not found' });
            }

            if (product && product.image && product.image.filename) {
                await cloudinary.uploader.destroy(product.image.filename);
            }

            await Store.findByIdAndDelete(req.params.id);

            res.status(200).json({
                description: 'Product deleted successfully',
            });
        } catch (err) {
            console.error('Error deleting product:', err);
            res.status(500).json({ message: 'Error deleting product' });
        }
    },

    fetchAffiliateProducts: async (req, res) => {
        try {
            const affiliateProduct = await Affiliate.find({});
            res.json(affiliateProduct);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error fetching products' });
        }
    },
};
