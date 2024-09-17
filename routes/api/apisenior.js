const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const { validateApiKey } = require('../../middleware.js');

const apiSeniorController = require('../../controllers/api/senior.js');

// Fetch all pyq and send as JSON
router.get('/', validateApiKey, apiSeniorController.fetchSenior);

// Create a new pyq
router.post('/', validateApiKey, wrapAsync(apiSeniorController.createSenior));

router.put('/:id', apiSeniorController.updateSenior);

router.delete('/:id', apiSeniorController.deleteSenior);

module.exports = router;
