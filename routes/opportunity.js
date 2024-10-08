const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunity');
const { validateOpportunity, isLoggedIn } = require('../middleware');
const authorizeRole = require('../utils/rolePermission.js');

router.get('/getopportunities', opportunityController.getOpportunities);

router.get(
    '/getopportunities/new',
    isLoggedIn,
    // authorizeRole('admin'),
    opportunityController.createGetOpportunitiesform
);

router.get('/getopportunities/:id', opportunityController.showGetOpportunities);

router.post(
    '/getopportunities',
    isLoggedIn,
    authorizeRole('admin'),
    validateOpportunity,
    opportunityController.createGetOpportunities
);

router.get(
    '/getopportunities/:id/edit',
    isLoggedIn,
    authorizeRole('admin'),
    opportunityController.editGetOpportunities
);

router.put(
    '/getopportunities/:id',
    isLoggedIn,
    authorizeRole('admin'),
    opportunityController.updateGetOpportunities
);

router.delete(
    '/getopportunities/:id',
    isLoggedIn,
    authorizeRole('admin'),
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
    isLoggedIn,
    authorizeRole('admin'),
    validateOpportunity,
    opportunityController.createGiveOpportunities
);

router.get(
    '/giveopportunities/:id/edit',
    isLoggedIn,
    authorizeRole('admin'),
    opportunityController.editGiveOpportunities
);

router.put(
    '/giveopportunities/:id',
    isLoggedIn,
    authorizeRole('admin'),
    opportunityController.updateGiveOpportunities
);

router.delete(
    '/giveopportunities/:id',
    isLoggedIn,
    authorizeRole('admin'),
    opportunityController.deleteGiveOpportunities
);

module.exports = router;
