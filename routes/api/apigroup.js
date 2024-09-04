const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const { validateApiKey } = require('../../middleware.js');

const apiGroupController = require('../../controllers/api/group.js');

// Fetch all pyq and send as JSON
router.get('/', validateApiKey, apiGroupController.fetchGroups);

// Create a new pyq
router.post('/', wrapAsync(apiGroupController.createGroup));

module.exports = router;
