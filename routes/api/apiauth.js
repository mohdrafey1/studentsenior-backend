const express = require('express');
const {
    signin,
    signup,
    google,
    signout,
} = require('../../controllers/api/auth');
const { validateApiKey } = require('../../middleware.js');

const router = express.Router();

router.post('/signup', validateApiKey, signup);
router.post('/signin', validateApiKey, signin);
router.post('/google', validateApiKey, google);
router.get('/signout', signout);

module.exports = router;
