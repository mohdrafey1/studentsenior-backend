const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const { validateApiKey, validateGroup } = require('../../middleware.js');

const apiGroupController = require('../../controllers/api/group.controller.js');

// all pyq
router.get('/', validateApiKey, wrapAsync(apiGroupController.fetchGroups));

router.get(
    '/college/:collegeId',
    validateApiKey,
    wrapAsync(apiGroupController.fetchGroupsByCollege)
);

// Create a new pyq
router.post('/', validateGroup, wrapAsync(apiGroupController.createGroup));

module.exports = router;
