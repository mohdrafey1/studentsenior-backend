const express = require('express');
const router = express.Router();
const { isLoggedIn, isRafey } = require('../middleware.js');

const homeController = require('../controllers/home.js');

router.get('/', isLoggedIn, homeController.home);

router.get('/user', isRafey, homeController.user);

router.get('/client', isRafey, homeController.client);

module.exports = router;
