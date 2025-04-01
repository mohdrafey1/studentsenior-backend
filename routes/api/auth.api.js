const express = require('express');
const {
  signin,
  signup,
  google,
  signout,
} = require('../../controllers/api/auth.controller.js');
const { validateApiKey } = require('../../middleware.js');
const wrapAsync = require('../../utils/wrapAsync.js');

const router = express.Router();

router.post('/signup', validateApiKey, wrapAsync(signup));

router.post('/signin', validateApiKey, wrapAsync(signin));

router.post('/google', validateApiKey, wrapAsync(google));

router.get('/signout', signout);

module.exports = router;
