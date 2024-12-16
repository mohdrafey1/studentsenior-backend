const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const { validateApiKey } = require('../../middleware.js');
const { verifyToken } = require('../../utils/verifyUser.js');

const apiSeniorController = require('../../controllers/api/senior.js');

// Fetch all pyq and send as JSON
router.get('/', validateApiKey, apiSeniorController.fetchSenior);

router.get(
    '/college/:collegeId',
    validateApiKey,
    apiSeniorController.fetchSeniorByCollege
);

// router.get('/:id', validateApiKey, apiSeniorController.fetchSeniorById); //discard later
router.get('/:slug', validateApiKey, apiSeniorController.fetchSeniorBySlug);

// Create a new pyq
router.post(
    '/',
    verifyToken,
    validateApiKey,
    wrapAsync(apiSeniorController.createSenior)
);

router.put('/:id', verifyToken, apiSeniorController.updateSenior);

router.delete('/:id', verifyToken, apiSeniorController.deleteSenior);

module.exports = router;
