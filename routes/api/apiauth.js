const express = require('express');
const {
    signin,
    signup,
    google,
    signout,
} = require('../../controllers/api/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.get('/signout', signout);

module.exports = router;
