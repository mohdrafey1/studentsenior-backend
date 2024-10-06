const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, validateStore } = require('../middleware.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2 MB in bytes
    },
});

const storeController = require('../controllers/store.js');

router
    .route('/')
    .get(isLoggedIn, wrapAsync(storeController.index))
    .post(
        isLoggedIn,
        upload.single('image'),
        validateStore,
        wrapAsync(storeController.createProduct)
    );

router.get('/new', isLoggedIn, wrapAsync(storeController.createStoreForm));

router.post(
    '/newaffiliate',
    isLoggedIn,
    wrapAsync(storeController.createAffiliateProduct)
);

router.get(
    '/newaffiliate',
    isLoggedIn,
    wrapAsync(storeController.createAffiliateForm)
);

router.get('/:id/edit', isLoggedIn, wrapAsync(storeController.editProductForm));

router
    .route('/:id')
    .put(
        isLoggedIn,
        upload.single('image'),
        validateStore,
        wrapAsync(storeController.editProduct)
    )
    .delete(isLoggedIn, wrapAsync(storeController.deleteProduct));

router.delete(
    '/affiliate/:id',
    isLoggedIn,
    wrapAsync(storeController.deleteAffiliateProduct)
);

module.exports = router;
