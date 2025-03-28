const express = require('express');
const { validateDashboardUser } = require('../../middleware');
const {
    signUp,
    signIn,
} = require('../../controllers/newdashboard/auth.controller');
const wrapAsync = require('../../utils/wrapAsync');

const router = express.Router();

router.post('/signup', validateDashboardUser, wrapAsync(signUp));

router.post('/signin', wrapAsync(signIn));

module.exports = router;
