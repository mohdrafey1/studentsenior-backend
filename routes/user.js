const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const userController = require('../controllers/user.js');

router.get('/secret/signup', userController.signupForm);

router.post('/signup', wrapAsync(userController.signup));

router.get('/login', userController.loginForm);

router.post(
    '/login',
    saveRedirectUrl,
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true,
    }),
    userController.login
);

router.get('/profile', userController.profile);

router.get('/logout', userController.logout);

module.exports = router;
