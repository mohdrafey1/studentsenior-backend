const express = require('express');
const collegesController = require('../../../controllers/dashboard/collegeController/college');
const {
    verifyDashboardUser,
    requireRole,
} = require('../../../utils/verifyDashboardUser');

const router = express.Router();

// View all colleges (Everyone)
router.get('/', collegesController.index);

// View a specific college (Everyone)
router.get('/:slug', collegesController.showCollege);

// Create a new college (Only Admin)
router.post(
    '/',
    verifyDashboardUser,
    requireRole(['Admin']),
    collegesController.createCollege
);

// Edit a college (Admin & Moderator)
router.put(
    '/:id',
    verifyDashboardUser,
    requireRole(['Admin', 'Moderator']),
    collegesController.editCollege
);

// Delete a college (Only Admin)
router.delete(
    '/:id',
    verifyDashboardUser,
    requireRole(['Admin']),
    collegesController.deleteCollege
);

module.exports = router;
