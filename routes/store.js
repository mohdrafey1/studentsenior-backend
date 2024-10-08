const express = require('express');
const router = express.Router();
const authorizeRole = require('../utils/rolePermission.js');
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
        authorizeRole('admin'),
        upload.single('image'),
        validateStore,
        wrapAsync(storeController.createProduct)
    );

router.get('/new', isLoggedIn, wrapAsync(storeController.createStoreForm));

router.post(
    '/newaffiliate',
    isLoggedIn,
    authorizeRole('admin'),
    wrapAsync(storeController.createAffiliateProduct)
);

router.get(
    '/newaffiliate',
    isLoggedIn,
    wrapAsync(storeController.createAffiliateForm)
);

router.get(
    '/:id/edit',
    authorizeRole('admin'),
    isLoggedIn,
    wrapAsync(storeController.editProductForm)
);

router
    .route('/:id')
    .put(
        isLoggedIn,
        authorizeRole('admin'),
        upload.single('image'),
        validateStore,
        wrapAsync(storeController.editProduct)
    )
    .delete(
        isLoggedIn,
        authorizeRole('admin'),
        wrapAsync(storeController.deleteProduct)
    );

router.delete(
    '/affiliate/:id',
    isLoggedIn,
    authorizeRole('admin'),
    wrapAsync(storeController.deleteAffiliateProduct)
);

module.exports = router;
