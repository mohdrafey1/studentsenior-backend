const express = require('express');
const router = express.Router();
const branchController = require('../../controllers/branchCourse/branch');

router.get('/', branchController.index);
router.get('/new', branchController.new);
router.post('/', branchController.create);
router.get('/:id/edit', branchController.edit);
router.post('/:id', branchController.update);
router.post('/:id/delete', branchController.delete);

module.exports = router;
