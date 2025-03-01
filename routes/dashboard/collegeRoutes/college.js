const express = require('express');
const collegesController = require('../../../controllers/dashboard/collegeController/college');
const collegeDataController = require('../../../controllers/dashboard/collegeController/collegesData');
const {
    verifyDashboardUser,
    requireRole,
} = require('../../../utils/verifyDashboardUser');
const wrapAsync = require('../../../utils/wrapAsync');

const router = express.Router();

// View all colleges (Everyone)
router.get('/', wrapAsync(collegesController.index));

// View a specific college (Everyone)
router.get('/:slug', wrapAsync(collegesController.showCollege));

// Create a new college (Only Admin)
router.post(
    '/',
    verifyDashboardUser,
    requireRole(['Admin']),
    wrapAsync(collegesController.createCollege)
);

// Edit a college (Admin & Moderator)
router.put(
    '/:id',
    verifyDashboardUser,
    requireRole(['Admin', 'Moderator']),
    wrapAsync(collegesController.editCollege)
);

// Delete a college (Only Admin)
router.delete(
    '/:id',
    verifyDashboardUser,
    requireRole(['Admin']),
    wrapAsync(collegesController.deleteCollege)
);

router.get('/collegedata/:slug', wrapAsync(collegeDataController.collegeData));

module.exports = router;
