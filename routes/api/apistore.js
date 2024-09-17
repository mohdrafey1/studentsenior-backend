const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const { validateApiKey } = require('../../middleware.js');
const multer = require('multer');
const { storage } = require('../../cloudConfig.js');
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2 MB in bytes
    },
});

const apiStoreController = require('../../controllers/api/store.js');

// Fetch all pyq and send as JSON
router.get('/', validateApiKey, apiStoreController.fetchProducts);

// Create a new pyq
router.post(
    '/',
    validateApiKey,
    upload.single('image'),
    wrapAsync(apiStoreController.createProduct)
);

router.put('/:id', upload.single('image'), apiStoreController.updateProduct);

router.delete('/:id', apiStoreController.deleteProduct);

module.exports = router;
