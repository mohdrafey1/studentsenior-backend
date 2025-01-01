const express = require('express');
const router = express.Router();
const { isLoggedIn, isRafey } = require('../middleware.js');

const homeController = require('../controllers/home.js');
const wrapAsync = require('../utils/wrapAsync.js');

router.get('/', isLoggedIn, wrapAsync(homeController.home));

router.get('/user', isRafey, wrapAsync(homeController.user));

router.get('/client', isRafey, wrapAsync(homeController.client));

module.exports = router;
