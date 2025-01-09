const Store = require('../../models/Store');
const { cloudinary } = require('../../cloudConfig.js');
const Affiliate = require('../../models/AffiliateProduct.js');
const Colleges = require('../../models/Colleges.js');

module.exports = {
    index: async (req, res) => {
        let store = await Store.find({}).populate('college');
        let affiliateProduct = await Affiliate.find({});
        res.render('store/index.ejs', { store, affiliateProduct });
    },

    createStoreForm: async (req, res) => {
        const colleges = await Colleges.find();

        res.render('store/new.ejs', { colleges });
    },

    createProduct: async (req, res) => {
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
    },

    editProductForm: async (req, res) => {
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
    },

    editProduct: async (req, res) => {
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
    },

    deleteProduct: async (req, res) => {
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
    },

    createAffiliateForm: async (req, res) => {
        res.render('store/newAffiliate.ejs');
    },

    createAffiliateProduct: async (req, res) => {
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
    },

    deleteAffiliateProduct: async (req, res) => {
        await Affiliate.findByIdAndDelete(req.params.id);

        req.flash('success', 'Product deleted successfully');
        res.redirect(`/store`);
    },
};
