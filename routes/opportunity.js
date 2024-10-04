const express = require('express');
const router = express.Router();

const opportunityController = require('../controllers/opportunity');
const { validateOpportunity } = require('../middleware');

router.get('/getopportunities', opportunityController.getOpportunities);

router.get(
    '/getopportunities/new',
    opportunityController.createGetOpportunitiesform
);

router.get('/getopportunities/:id', opportunityController.showGetOpportunities);

router.post(
    '/getopportunities',
    validateOpportunity,
    opportunityController.createGetOpportunities
);

router.get(
    '/getopportunities/:id/edit',
    opportunityController.editGetOpportunities
);

router.put(
    '/getopportunities/:id',
    opportunityController.updateGetOpportunities
);

router.delete(
    '/getopportunities/:id',
    opportunityController.deleteGetOpportunities
);

router.get('/giveopportunities', opportunityController.giveOpportunities);

router.get(
    '/giveopportunities/new',
    opportunityController.createGiveOpportunitiesform
);

router.get(
    '/giveopportunities/:id',
    opportunityController.showGiveOpportunities
);

router.post(
    '/giveopportunities',
    validateOpportunity,
    opportunityController.createGiveOpportunities
);

router.get(
    '/giveopportunities/:id/edit',
    opportunityController.editGiveOpportunities
);

router.put(
    '/giveopportunities/:id',
    opportunityController.updateGiveOpportunities
);

router.delete(
    '/giveopportunities/:id',
    opportunityController.deleteGiveOpportunities
);

module.exports = router;
