const Store = require('../models/Store');
const { cloudinary } = require('../cloudConfig.js');

module.exports = {
    index: async (req, res) => {
        try {
            let store = await Store.find({}).populate('college');
            res.render('store/index.ejs', { store });
        } catch (err) {
            console.error(err);
            req.flash('error', 'Error fetching products');
            res.redirect('/store');
        }
    },

    createStoreForm: async (req, res) => {
        try {
            res.render('store/new.ejs');
        } catch (err) {
            console.error(err);
            req.flash('error', 'Error loading form');
            res.redirect('/store');
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
                owner,
                college,
                status,
                available,
            } = req.body;

            const newProduct = new Store({
                name,
                price,
                description,
                whatsapp,
                telegram,
                owner,
                college,
                status: status === 'true', // Convert status to boolean
                available: available === 'true', // Convert available to boolean
                image: { url, filename },
            });

            newProduct.owner = '66d3972a467ac23a9a5fd127'; // Hardcoded, update dynamically later

            await newProduct.save();
            req.flash('success', 'Product Created Successfully');
            res.redirect('/store');
        } catch (err) {
            console.error(err);
            req.flash('error', 'Error creating product');
            res.redirect('/store/new');
        }
    },

    editProductForm: async (req, res) => {
        try {
            const { id } = req.params;
            const store = await Store.findById(id);

            if (!store) {
                req.flash('error', 'Product not found!');
                return res.redirect('/store');
            }

            let previousImageUrl = store.image.url.replace(
                '/upload',
                '/upload/h_200,w_250'
            );
            res.render('store/edit', { store, previousImageUrl });
        } catch (err) {
            console.error(err);
            req.flash('error', 'Error loading product');
            res.redirect('/store');
        }
    },

    editProduct: async (req, res) => {
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

            // Find and update product details
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

            if (!updatedProduct) {
                req.flash('error', 'Product not found');
                return res.redirect('/store');
            }

            req.flash('success', 'Product updated successfully');
            res.redirect('/store');
        } catch (err) {
            console.error(err);
            req.flash('error', 'Error updating product');
            res.redirect(`/store/${req.params.id}/edit`);
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const product = await Store.findById(req.params.id);

            if (product && product.image && product.image.filename) {
                // Delete the image from Cloudinary
                const result = await cloudinary.uploader.destroy(
                    product.image.filename
                );
            }
            await Store.findByIdAndDelete(req.params.id);

            req.flash('success', 'Product deleted successfully');
            res.redirect(`/store`);
        } catch (err) {
            console.error('Error deleting product:', err);
            req.flash('error', 'Error deleting Product');
            res.redirect(`/store`);
        }
    },
};
