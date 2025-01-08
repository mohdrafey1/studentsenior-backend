const { GetOpportunity, GiveOpportunity } = require('../../models/Opportunity');
const Colleges = require('../../models/Colleges');

module.exports = {
    getOpportunities: async (req, res) => {
        const allGetOpportunities = await GetOpportunity.find({})
            .populate('college')
            .populate('owner');

        res.render('opportunity/getOpportunity/index.ejs', {
            allGetOpportunities,
        });
    },

    createGetOpportunitiesform: async (req, res) => {
        const colleges = await Colleges.find();
        res.render('opportunity/getOpportunity/new.ejs', { colleges });
    },

    createGetOpportunities: async (req, res) => {
        const { name, description, college, whatsapp, email, status } =
            req.body;

        let owner = req.user.id;
        const newGetOpportunity = new GetOpportunity({
            name,
            description,
            college,
            whatsapp,
            email,
            owner,
            status,
        });
        await newGetOpportunity.save();
        req.flash('success', 'Get Opportunity Created Successfully');
        return res.redirect(`/opportunity/getopportunities`);
    },

    showGetOpportunities: async (req, res) => {
        const { id } = req.params;
        const getOpportunity = await GetOpportunity.findById(id)
            .populate('college')
            .populate('owner');
        if (!getOpportunity) {
            req.flash('error', 'opportunity not found!');
            return res.redirect(`/opportunity/getopportunities`);
        }
        res.render('opportunity/getOpportunity/show', { getOpportunity });
    },

    editGetOpportunities: async (req, res) => {
        const { id } = req.params;
        const getOpportunity = await GetOpportunity.findById(id);
        const colleges = await Colleges.find();
        if (!getOpportunity) {
            req.flash('error', 'Opportunity not found!');
            return res.redirect('/opportunity/getopportunities');
        }

        res.render('opportunity/getOpportunity/edit.ejs', {
            getOpportunity,
            colleges,
        });
    },

    updateGetOpportunities: async (req, res) => {
        const id = req.params.id;
        const { name, description, college, whatsapp, email, status } =
            req.body;

        const updatedGetOpportunity = await GetOpportunity.findByIdAndUpdate(
            id,
            {
                name,
                description,
                college,
                whatsapp,
                email,
                status,
            },
            { new: true }
        );

        if (!updatedGetOpportunity) {
            req.flash('error', 'opportunity not found!');
            return res.redirect(`/opportunity/getopportunities`);
        }

        req.flash('success', 'Get Opportunity Updated Successfully');
        return res.redirect(`/opportunity/getopportunities/${id}`);
    },

    deleteGetOpportunities: async (req, res) => {
        await GetOpportunity.findByIdAndDelete(req.params.id);
        res.redirect(`/opportunity/getopportunities`);
    },

    giveOpportunities: async (req, res) => {
        const allGiveOpportunities = await GiveOpportunity.find({})
            .populate('college')
            .populate('owner');

        res.render('opportunity/giveOpportunity/index.ejs', {
            allGiveOpportunities,
        });
    },

    createGiveOpportunitiesform: async (req, res) => {
        const colleges = await Colleges.find();
        res.render('opportunity/giveOpportunity/new.ejs', { colleges });
    },

    createGiveOpportunities: async (req, res) => {
        const { name, description, college, whatsapp, email, status } =
            req.body;

        let owner = req.user.id;
        const newGiveOpportunity = new GiveOpportunity({
            name,
            description,
            college,
            whatsapp,
            email,
            owner,
            status,
        });
        await newGiveOpportunity.save();
        req.flash('success', 'Get Opportunity Created Successfully');
        return res.redirect(`/opportunity/giveopportunities`);
    },

    showGiveOpportunities: async (req, res) => {
        const { id } = req.params;
        const giveOpportunity = await GiveOpportunity.findById(id)
            .populate('college')
            .populate('owner');
        if (!giveOpportunity) {
            req.flash('error', 'opportunity not found!');
            return res.redirect(`/opportunity/giveopportunities`);
        }
        res.render('opportunity/giveOpportunity/show', { giveOpportunity });
    },

    editGiveOpportunities: async (req, res) => {
        const colleges = await Colleges.find();
        const { id } = req.params;
        const giveopportunity = await GiveOpportunity.findById(id);
        if (!giveopportunity) {
            req.flash('error', 'Opportunity not found!');
            return res.redirect('/opportunity/giveopportunities');
        }

        res.render('opportunity/giveOpportunity/edit.ejs', {
            giveopportunity,
            colleges,
        });
    },

    updateGiveOpportunities: async (req, res) => {
        const id = req.params.id;
        const {
            name,
            description,
            college,
            whatsapp,
            email,
            status = true,
        } = req.body;

        const updatedGiveOpportunity = await GiveOpportunity.findByIdAndUpdate(
            id,
            {
                name,
                description,
                college,
                whatsapp,
                email,
                status,
            },
            { new: true }
        );

        if (!updatedGiveOpportunity) {
            return res.status(404).json({ message: 'Opportunity not found' });
        }

        req.flash('success', 'Get Opportunity Updated Successfully');
        return res.redirect(`/opportunity/giveopportunities/${id}`);
    },

    deleteGiveOpportunities: async (req, res) => {
        await GiveOpportunity.findByIdAndDelete(req.params.id);
        res.redirect(`/opportunity/giveopportunities`);
    },
};
