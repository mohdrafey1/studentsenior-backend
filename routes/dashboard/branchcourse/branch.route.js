const express = require('express');
const router = express.Router();
const wrapAsync = require('../../../utils/wrapAsync.js');
const branchController = require('../../../controllers/dashboard/branchCourse/branch.controller.js');

router.get('/', wrapAsync(branchController.index));
router.get('/new', wrapAsync(branchController.new));
router.post('/', wrapAsync(branchController.create));
router.get('/:id/edit', wrapAsync(branchController.edit));
router.post('/:id', wrapAsync(branchController.update));
router.post('/:id/delete', wrapAsync(branchController.delete));

module.exports = router;
