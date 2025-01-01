const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const { validateApiKey } = require('../../middleware.js');
const { verifyToken } = require('../../utils/verifyUser.js');

const apiSeniorController = require('../../controllers/api/senior.js');

// Fetch all pyq and send as JSON
router.get('/', validateApiKey, wrapAsync(apiSeniorController.fetchSenior));

router.get(
    '/college/:collegeId',
    validateApiKey,
    wrapAsync(apiSeniorController.fetchSeniorByCollege)
);

// router.get('/:id', validateApiKey, apiSeniorController.fetchSeniorById); //discard later
router.get(
    '/:slug',
    validateApiKey,
    wrapAsync(apiSeniorController.fetchSeniorBySlug)
);

// Create a new pyq
router.post(
    '/',
    verifyToken,
    validateApiKey,
    wrapAsync(apiSeniorController.createSenior)
);

router.put('/:id', verifyToken, wrapAsync(apiSeniorController.updateSenior));

router.delete('/:id', verifyToken, wrapAsync(apiSeniorController.deleteSenior));

module.exports = router;
