const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Client = require('../../models/Client');
const Senior = require('../../models/Senior.js');
const Store = require('../../models/Store.js');
const Colleges = require('../../models/Colleges');
const Groups = require('../../models/WhatsappGroup');
const Notes = require('../../models/Notes');
const {
    GetOpportunity,
    GiveOpportunity,
} = require('../../models/Opportunity.js');
const { isLoggedIn } = require('../../middleware.js');
const authorizeRole = require('../../utils/rolePermission.js');
const wrapAsync = require('../../utils/wrapAsync.js');
const NewPyqs = require('../../models/NewPyqs.js');

router.put(
    '/:type/:id',
    isLoggedIn,
    authorizeRole('admin'),
    wrapAsync(async (req, res) => {
        const { type, id } = req.params;
        const { status } = req.body;

        let model;
        if (type === 'pyq') model = NewPyqs;
        else if (type === 'senior') model = Senior;
        else if (type === 'college') model = Colleges;
        else if (type === 'product') model = Store;
        else if (type === 'note') model = Notes;
        else if (type === 'group') model = Groups;
        else if (type === 'getOpportunity') model = GetOpportunity;
        else if (type === 'giveOpportunity') model = GiveOpportunity;

        await model.findByIdAndUpdate(id, { status });
        res.json({ success: true });
    })
);

module.exports = router;
