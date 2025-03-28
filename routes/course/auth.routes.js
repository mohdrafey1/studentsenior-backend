const express = require('express');
const { getUserDetail } = require('../../controllers/course/auth.controller');
const wrapAsync = require('../../utils/wrapAsync');
const { verifyToken } = require('../../utils/verifyUser');

const router = express.Router();

router.get('/', verifyToken, wrapAsync(getUserDetail));

module.exports = router;
