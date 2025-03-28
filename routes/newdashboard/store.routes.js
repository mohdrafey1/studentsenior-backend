const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const {
    allAffiliateProducts,
    allStoreProducts,
} = require('../../controllers/newdashboard/store.controller.js');

router.get('/affiliate', wrapAsync(allAffiliateProducts));

router.get('/:collegeName', wrapAsync(allStoreProducts));

module.exports = router;
