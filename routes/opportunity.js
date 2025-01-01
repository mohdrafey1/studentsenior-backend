const express = require('express');
const router = express.Router();
const opportunityController = require('../controllers/opportunity');
const { validateOpportunity, isLoggedIn } = require('../middleware');
const authorizeRole = require('../utils/rolePermission.js');
const wrapAsync = require('../utils/wrapAsync.js');

router.get(
    '/getopportunities',
    wrapAsync(opportunityController.getOpportunities)
);

router.get(
    '/getopportunities/new',
    isLoggedIn,
    // authorizeRole('admin'),
    wrapAsync(opportunityController.createGetOpportunitiesform)
);

router.get(
    '/getopportunities/:id',
    wrapAsync(opportunityController.showGetOpportunities)
);

router.post(
    '/getopportunities',
    isLoggedIn,
    authorizeRole('admin'),
    validateOpportunity,
    wrapAsync(opportunityController.createGetOpportunities)
);

router.get(
    '/getopportunities/:id/edit',
    isLoggedIn,
    authorizeRole('admin'),
    wrapAsync(opportunityController.editGetOpportunities)
);

router.put(
    '/getopportunities/:id',
    isLoggedIn,
    authorizeRole('admin'),
    wrapAsync(opportunityController.updateGetOpportunities)
);

router.delete(
    '/getopportunities/:id',
    isLoggedIn,
    authorizeRole('admin'),
    wrapAsync(opportunityController.deleteGetOpportunities)
);

router.get(
    '/giveopportunities',
    wrapAsync(opportunityController.giveOpportunities)
);

router.get(
    '/giveopportunities/new',
    wrapAsync(opportunityController.createGiveOpportunitiesform)
);

router.get(
    '/giveopportunities/:id',
    wrapAsync(opportunityController.showGiveOpportunities)
);

router.post(
    '/giveopportunities',
    isLoggedIn,
    authorizeRole('admin'),
    validateOpportunity,
    wrapAsync(opportunityController.createGiveOpportunities)
);

router.get(
    '/giveopportunities/:id/edit',
    isLoggedIn,
    authorizeRole('admin'),
    wrapAsync(opportunityController.editGiveOpportunities)
);

router.put(
    '/giveopportunities/:id',
    isLoggedIn,
    authorizeRole('admin'),
    wrapAsync(opportunityController.updateGiveOpportunities)
);

router.delete(
    '/giveopportunities/:id',
    isLoggedIn,
    authorizeRole('admin'),
    wrapAsync(opportunityController.deleteGiveOpportunities)
);

module.exports = router;
