const express = require('express');
const {
    updateUser,
    deleteUser,
} = require('../../controllers/api/user.controller.js');
const { verifyToken } = require('../../utils/verifyUser.js');
const { validateApiKey } = require('../../middleware.js');
const wrapAsync = require('../../utils/wrapAsync.js');

const router = express.Router();

router.post('/update/:id', verifyToken, validateApiKey, wrapAsync(updateUser));

// router.delete('/delete/:id', verifyToken, wrapAsync(deleteUser));  //will implement later if needed

module.exports = router;
