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

const apiStoreController = require('../../controllers/api/store.js');

// Fetch all pyq
router.get('/', validateApiKey, apiStoreController.fetchProducts);

router.get(
    '/college/:collegeId',
    validateApiKey,
    apiStoreController.fetchProductByCollege
);

router.get(
    '/suggested/:collegeId/:slug',
    validateApiKey,
    apiStoreController.fetchSuggestedProducts
);

// router.get('/:id', validateApiKey, apiStoreController.fetchProductById);

router.get('/:slug', validateApiKey, apiStoreController.fetchPyqBySlug);

router.get(
    '/affiliate',
    validateApiKey,
    apiStoreController.fetchAffiliateProducts
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
    apiStoreController.updateProduct
);

router.delete('/:id', verifyToken, apiStoreController.deleteProduct);

module.exports = router;
