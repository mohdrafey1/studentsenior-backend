const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const { validateApiKey } = require('../../middleware.js');

const apiPyqController = require('../../controllers/api/pyq.controller.js');

// Fetch all pyq and send as JSON
router.get('/', validateApiKey, wrapAsync(apiPyqController.fetchPyq));

router.get(
    '/college/:collegeId',
    validateApiKey,
    wrapAsync(apiPyqController.fetchPyqByCollege)
);

router.get(
    '/:collegeId/bundle',
    validateApiKey,
    wrapAsync(apiPyqController.fetchPyqBundle)
);

// router.get('/:id', validateApiKey, apiPyqController.fetchPyqById); // discard later
router.get(
    '/:slug',
    validateApiKey,
    wrapAsync(apiPyqController.fetchPyqBySlug)
);

router.get(
    '/:collegeId/:pyqId/related-pyqs',
    validateApiKey,
    wrapAsync(apiPyqController.fetchRelatedPapers)
);

router.post('/request-pyq', wrapAsync(apiPyqController.requestPyq));

// Create a new pyq
// router.post('/', wrapAsync(apiPyqController.createPyq));

module.exports = router;
