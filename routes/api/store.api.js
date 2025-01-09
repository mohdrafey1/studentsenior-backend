const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const { validateApiKey } = require('../../middleware.js');
const { verifyToken } = require('../../utils/verifyUser.js');
const multer = require('multer');
const { storage } = require('../../cloudConfig.js');
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2 MB in bytes
    },
});

const apiStoreController = require('../../controllers/api/store.controller.js');

// Fetch all pyq
router.get('/', validateApiKey, wrapAsync(apiStoreController.fetchProducts));

router.get(
    '/college/:collegeId',
    validateApiKey,
    wrapAsync(apiStoreController.fetchProductByCollege)
);

router.get(
    '/suggested/:collegeId/:slug',
    validateApiKey,
    wrapAsync(apiStoreController.fetchSuggestedProducts)
);

// router.get('/:id', validateApiKey, apiStoreController.fetchProductById);

router.get(
    '/:slug',
    validateApiKey,
    wrapAsync(apiStoreController.fetchPyqBySlug)
);

router.get(
    '/affiliate',
    validateApiKey,
    wrapAsync(apiStoreController.fetchAffiliateProducts)
);

// Create a new pyq
router.post(
    '/',
    verifyToken,
    upload.single('image'),
    wrapAsync(apiStoreController.createProduct)
);

router.put(
    '/:id',
    verifyToken,
    upload.single('image'),
    wrapAsync(apiStoreController.updateProduct)
);

router.delete('/:id', verifyToken, wrapAsync(apiStoreController.deleteProduct));

module.exports = router;
