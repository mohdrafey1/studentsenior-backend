const express = require('express');
const router = express.Router();
const authorizeRole = require('../utils/rolePermission.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, validateSenior } = require('../middleware.js');

const seniorController = require('../controllers/senior.js');

router
    .route('/')
    .get(isLoggedIn, wrapAsync(seniorController.index))
    .post(
        isLoggedIn,
        authorizeRole('admin'),
        validateSenior,
        wrapAsync(seniorController.createSenior)
    );

router.get('/new', isLoggedIn, wrapAsync(seniorController.createSeniorForm));

router.get(
    '/:id/edit',
    isLoggedIn,
    authorizeRole('admin'),
    wrapAsync(seniorController.editSeniorForm)
);

router
    .route('/:id')
    .get(isLoggedIn, wrapAsync(seniorController.showSenior))
    .put(
        isLoggedIn,
        authorizeRole('admin'),
        wrapAsync(seniorController.editSenior)
    )
    .delete(
        isLoggedIn,
        authorizeRole('admin'),
        wrapAsync(seniorController.deleteSenior)
    );

module.exports = router;
