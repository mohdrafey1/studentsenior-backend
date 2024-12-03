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
            }).populate('college');

            return res.status(200).json(store);
        } catch (err) {
            return res
                .status(500)
                .json({ message: 'Some error occurred on the server' });
        }
    },

    fetchSuggestedProducts: async (req, res) => {
        const { collegeId, id } = req.params;
        try {
            const suggestedProducts = await Store.find({
                status: true,
                college: collegeId,
                _id: { $ne: id },
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

    fetchProductById: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Store.findOne({ _id: id, status: true });
            if (!product) {
                return res
                    .status(404)
                    .json({ message: 'Product not found or inactive' });
            }
            res.json(product);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error fetching products' });
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

            const newProduct = new Store({
                name,
                price,
                description,
                whatsapp,
                telegram,
                owner,
                college,
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
