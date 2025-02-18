const express = require('express');
const router = express.Router();
const wrapAsync = require('../../utils/wrapAsync.js');
const { validateApiKey } = require('../../middleware.js');
const { verifyToken } = require('../../utils/verifyUser.js');

const apiNewpyqController = require('../../controllers/api/newPyq.controller.js');

router.get(
    '/college/:collegeId',
    validateApiKey,
    wrapAsync(apiNewpyqController.fetchPyqsByCollege)
);

router.get(
    '/:branchCode/:subjectCode/:collegeId',
    validateApiKey,
    wrapAsync(apiNewpyqController.fetchPyqsByCollegeBranch)
);

router.post('/', verifyToken, wrapAsync(apiNewpyqController.createPyq));

router.get(
    '/:slug',
    validateApiKey,
    verifyToken,
    wrapAsync(apiNewpyqController.getPyq)
);

router.post(
    '/purchase/:id',
    verifyToken,
    wrapAsync(apiNewpyqController.purchasePyq)
);

router.delete('/:id', verifyToken, wrapAsync(apiNewpyqController.deletePyq));

router.put('/:id', verifyToken, wrapAsync(apiNewpyqController.editPyq));

module.exports = router;
