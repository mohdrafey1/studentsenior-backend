const Store = require('../models/Store');
const { cloudinary } = require('../cloudConfig.js');
const Affiliate = require('../models/AffiliateProduct.js');
const Colleges = require('../models/Colleges.js');

module.exports = {
    index: async (req, res) => {
        try {
            let store = await Store.find({}).populate('college');
            let affiliateProduct = await Affiliate.find({});
            res.render('store/index.ejs', { store, affiliateProduct });
        } catch (err) {
            console.error(err);
            req.flash('error', 'Error fetching products');
            res.redirect('/store');
        }
    },

    createStoreForm: async (req, res) => {
        const colleges = await Colleges.find();
        try {
            res.render('store/new.ejs', { colleges });
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
                status: status === 'true',
                available: available === 'true',
                image: { url, filename },
            });

            newProduct.owner = '66d3972a467ac23a9a5fd127';

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
            const colleges = await Colleges.find();
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
            res.render('store/edit', { store, previousImageUrl, colleges });
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

    createAffiliateForm: async (req, res) => {
        try {
            res.render('store/newAffiliate.ejs');
        } catch (err) {
            console.error(err);
            req.flash('error', 'Error loading form');
            res.redirect('/store');
        }
    },

    createAffiliateProduct: async (req, res) => {
        try {
            const { name, price, description, image, link } = req.body;

            const newProduct = new Affiliate({
                name,
                price,
                description,
                image,
                link,
            });

            await newProduct.save();
            req.flash('success', 'Product Created Successfully');
            res.redirect('/store');
        } catch (err) {
            console.error(err);
            req.flash('error', 'Error creating product');
            res.redirect('/store/newaffiliate');
        }
    },

    deleteAffiliateProduct: async (req, res) => {
        try {
            await Affiliate.findByIdAndDelete(req.params.id);

            req.flash('success', 'Product deleted successfully');
            res.redirect(`/store`);
        } catch (err) {
            console.error('Error deleting product:', err);
            req.flash('error', 'Error deleting Product');
            res.redirect(`/store`);
        }
    },
};
