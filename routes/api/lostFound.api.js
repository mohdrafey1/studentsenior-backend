const express = require('express');
const router = express.Router();
const lostFoundController = require('../../controllers/api/lostFound.controller');
const { verifyToken } = require('../../utils/verifyUser');
const { validateLostFound } = require('../../middleware');

// Create an item
router.post(
    '/',
    validateLostFound,
    verifyToken,
    lostFoundController.createItem
);

// Get all items
router.get('/college/:collegeId', lostFoundController.getAllItems);

// Get a specific item by slug
router.get('/:slug', lostFoundController.getItemBySlug);

// Update an item by slug
router.put('/:slug', verifyToken, lostFoundController.updateItem);

// Delete an item by slug
router.delete('/:slug', verifyToken, lostFoundController.deleteItem);

module.exports = router;
