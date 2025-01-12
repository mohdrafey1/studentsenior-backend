const express = require('express');
const {
    updateUser,
    deleteUser,
    userResources,
    redeemPoints,
} = require('../../controllers/api/user.controller.js');
const { verifyToken } = require('../../utils/verifyUser.js');
const { validateApiKey } = require('../../middleware.js');
const wrapAsync = require('../../utils/wrapAsync.js');

const router = express.Router();

router.post('/update/:id', verifyToken, validateApiKey, wrapAsync(updateUser));

router.get('/userdata', verifyToken, validateApiKey, wrapAsync(userResources));

router.post(
    '/redeempoints',
    verifyToken,
    validateApiKey,
    wrapAsync(redeemPoints)
);

// router.delete('/delete/:id', verifyToken, wrapAsync(deleteUser));  //will implement later if needed

module.exports = router;
