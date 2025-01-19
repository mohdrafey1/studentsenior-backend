const express = require('express');
const router = express.Router();
const User = require('../../models/User.js');
const wrapAsync = require('../../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../../middleware.js');

const userController = require('../../controllers/dashboard/user.controller.js');

router.get('/secret/signup', userController.signupForm);

router.post('/secret/signup', userController.signup);

router.get('/login', userController.loginForm);

router.post(
    '/login',
    saveRedirectUrl,
    passport.authenticate('local', {
        failureRedirect: '/user/login',
        failureFlash: true,
    }),
    userController.login
);

router.get('/profile', userController.profile);

router.get('/logout', userController.logout);

module.exports = router;
