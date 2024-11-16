const express = require('express');
const router = express.Router();

const opportunityController = require('../../controllers/api/opportunity');
const { verifyToken } = require('../../utils/verifyUser');
const { validateApiKey } = require('../../middleware');

router.get(
    '/getopportunities',
    validateApiKey,
    opportunityController.getOpportunities
);

router.get(
    '/getopportunities/college/:collegeId',
    validateApiKey,
    opportunityController.getOpportunitiesByCollege
);

router.post(
    '/getopportunities',
    verifyToken,
    opportunityController.createGetOpportunities
);

router.put(
    '/getopportunities/:id',
    verifyToken,
    opportunityController.updateGetOpportunities
);

router.delete(
    '/getopportunities/:id',
    verifyToken,
    opportunityController.deleteGetOpportunities
);

router.get(
    '/giveopportunities',
    validateApiKey,
    opportunityController.giveOpportunities
);

router.get(
    '/giveopportunities/college/:collegeId',
    validateApiKey,
    opportunityController.giveOpportunities
);

router.post(
    '/giveopportunities',
    verifyToken,
    opportunityController.createGiveOpportunities
);

router.put(
    '/giveopportunities/:id',
    verifyToken,
    opportunityController.updateGiveOpportunities
);

router.delete(
    '/giveopportunities/:id',
    verifyToken,
    opportunityController.deleteGiveOpportunities
);

module.exports = router;
