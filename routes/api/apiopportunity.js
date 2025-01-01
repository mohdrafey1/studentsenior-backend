const express = require('express');
const router = express.Router();

const opportunityController = require('../../controllers/api/opportunity');
const { verifyToken } = require('../../utils/verifyUser');
const { validateApiKey } = require('../../middleware');
const wrapAsync = require('../../utils/wrapAsync');

router.get(
    '/getopportunities',
    validateApiKey,
    wrapAsync(opportunityController.getOpportunities)
);

router.get(
    '/getopportunities/college/:collegeId',
    validateApiKey,
    wrapAsync(opportunityController.getOpportunitiesByCollege)
);

router.post(
    '/getopportunities',
    verifyToken,
    wrapAsync(opportunityController.createGetOpportunities)
);

router.put(
    '/getopportunities/:id',
    verifyToken,
    wrapAsync(opportunityController.updateGetOpportunities)
);

router.delete(
    '/getopportunities/:id',
    verifyToken,
    wrapAsync(opportunityController.deleteGetOpportunities)
);

router.get(
    '/giveopportunities',
    validateApiKey,
    wrapAsync(opportunityController.giveOpportunities)
);

router.get(
    '/giveopportunities/college/:collegeId',
    validateApiKey,
    wrapAsync(opportunityController.giveOpportunities)
);

router.post(
    '/giveopportunities',
    verifyToken,
    wrapAsync(opportunityController.createGiveOpportunities)
);

router.put(
    '/giveopportunities/:id',
    verifyToken,
    wrapAsync(opportunityController.updateGiveOpportunities)
);

router.delete(
    '/giveopportunities/:id',
    verifyToken,
    wrapAsync(opportunityController.deleteGiveOpportunities)
);

module.exports = router;
