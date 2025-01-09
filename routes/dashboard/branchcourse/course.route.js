const express = require('express');
const router = express.Router();
const courseController = require('../../../controllers/dashboard/branchCourse/course.controller');
const wrapAsync = require('../../../utils/wrapAsync');

router.get('/', wrapAsync(courseController.index));
router.get('/new', wrapAsync(courseController.new));
router.post('/', wrapAsync(courseController.create));
router.get('/:id/edit', wrapAsync(courseController.edit));
router.post('/:id', wrapAsync(courseController.update));
router.post('/:id/delete', wrapAsync(courseController.delete));

module.exports = router;
