const express = require('express');
const { updateUser, deleteUser } = require('../../controllers/api/user.js');
const { verifyToken } = require('../../utils/verifyUser.js');
const { validateApiKey } = require('../../middleware.js');

const router = express.Router();

router.post('/update/:id', validateApiKey, updateUser); // add verify token later (verifyToken)

// router.delete('/delete/:id', verifyToken, deleteUser);  //will implement later if needed

module.exports = router;
