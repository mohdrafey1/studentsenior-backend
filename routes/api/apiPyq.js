const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const { validateApiKey } = require('../../middleware.js');

const apiPyqController = require('../../controllers/api/pyq.js');

// Fetch all pyq and send as JSON
router.get('/', validateApiKey, apiPyqController.fetchPyq);

router.get(
    '/college/:collegeId',
    validateApiKey,
    apiPyqController.fetchPyqByCollege
);

router.get(
    '/:collegeId/bundle',
    validateApiKey,
    apiPyqController.fetchPyqBundle
);

// router.get('/:id', validateApiKey, apiPyqController.fetchPyqById); // discard later
router.get('/:slug', validateApiKey, apiPyqController.fetchPyqBySlug);

router.get(
    '/:collegeId/:pyqId/related-pyqs',
    validateApiKey,
    apiPyqController.fetchRelatedPapers
);

router.post('/request-pyq', apiPyqController.requestPyq);

// Create a new pyq
// router.post('/', wrapAsync(apiPyqController.createPyq));

module.exports = router;
