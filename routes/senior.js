const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, validateSenior } = require('../middleware.js');

const seniorController = require('../controllers/senior.js');

router
    .route('/')
    .get(isLoggedIn, wrapAsync(seniorController.index))
    .post(isLoggedIn, validateSenior, wrapAsync(seniorController.createSenior));

router.get('/new', isLoggedIn, wrapAsync(seniorController.createSeniorForm));

router.get('/:id/edit', isLoggedIn, wrapAsync(seniorController.editSeniorForm));

router
    .route('/:id')
    .get(isLoggedIn, wrapAsync(seniorController.showSenior))
    .put(isLoggedIn, wrapAsync(seniorController.editSenior))
    .delete(isLoggedIn, wrapAsync(seniorController.deleteSenior));

module.exports = router;
