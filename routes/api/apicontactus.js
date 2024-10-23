const express = require('express');
const router = express.Router();

const contactus = require('../../controllers/api/contactus');

router.post('/', contactus.createContactus);

module.exports = router;
