const express = require('express');
const router = express.Router();

const contactus = require('../../controllers/api/contactus');
const wrapAsync = require('../../utils/wrapAsync');

router.post('/', wrapAsync(contactus.createContactus));

module.exports = router;
