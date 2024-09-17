const Store = require('../../models/Store.js');
const { cloudinary } = require('../../cloudConfig.js');
const jwt = require('jsonwebtoken');

module.exports = {
    fetchProducts: async (req, res) => {
        try {
            let store = await Store.find({}).populate('college');
            res.json(store);
        } catch (err) {
            console.error(err);
            res.status(500).json({ description: 'Error fetching products' });
        }
    },

    createProduct: async (req, res) => {
        try {
            let url = req.file.path;
            let filename = req.file.filename;

            const {
                name,
                price,
                description,
                whatsapp,
                telegram,
                college,
                status,
                available,
            } = req.body;

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

            const newProduct = new Store({
                name,
                price,
                description,
                whatsapp,
                telegram,
                owner,
                college,
                status: status === 'true',
                available: available === 'true',
                image: { url, filename },
            });

            await newProduct.save();
            res.status(201).json({
                description: 'Product Created Successfully',
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ description: 'Error creating product' });
        }
    },

    // getProduct: async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         const product = await Store.findById(id);

    //         if (!product) {
    //             return res
    //                 .status(404)
    //                 .json({ description: 'Product not found' });
    //         }

    //         let previousImageUrl = product.image.url.replace(
    //             '/upload',
    //             '/upload/h_200,w_250'
    //         );
    //         res.json({ product, previousImageUrl });
    //     } catch (err) {
    //         console.error(err);
    //         res.status(500).json({ description: 'Error loading product' });
    //     }
    // },

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
                status,
                available,
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
                    status: status === 'true',
                    available: available === 'true',
                },
                { new: true }
            );

            if (!updatedProduct) {
                return res
                    .status(404)
                    .json({ description: 'Product not found' });
            }

            if (req.file) {
                // Delete the old image from Cloudinary if it exists
                if (updatedProduct.image && updatedProduct.image.filename) {
                    await cloudinary.uploader.destroy(
                        updatedProduct.image.filename
                    );
                }

                // Upload the new image
                const url = req.file.path;
                const filename = req.file.filename;

                // Update image details
                updatedProduct.image = { url, filename };
            }

            await updatedProduct.save();

            res.json({
                description: 'Product updated successfully',
                updatedProduct,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ description: 'Error updating product' });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const product = await Store.findById(req.params.id);

            if (product && product.image && product.image.filename) {
                // Delete the image from Cloudinary
                await cloudinary.uploader.destroy(product.image.filename);
            }

            await Store.findByIdAndDelete(req.params.id);

            res.json({ description: 'Product deleted successfully' });
        } catch (err) {
            console.error('Error deleting product:', err);
            res.status(500).json({ description: 'Error deleting product' });
        }
    },
};
