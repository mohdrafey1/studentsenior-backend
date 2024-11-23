const express = require('express');
const router = express.Router();
const courseController = require('../../controllers/branchCourse/course');

router.get('/', courseController.index);
router.get('/new', courseController.new);
router.post('/', courseController.create);
router.get('/:id/edit', courseController.edit);
router.post('/:id', courseController.update);
router.post('/:id/delete', courseController.delete);

module.exports = router;
