const { GetOpportunity, GiveOpportunity } = require('../models/Opportunity');

module.exports = {
    getOpportunities: async (req, res) => {
        try {
            const allGetOpportunities = await GetOpportunity.find({})
                .populate('college')
                .populate('owner');

            res.render('opportunity/getOpportunity/index.ejs', {
                allGetOpportunities,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: 'Unable to Fetch Get Opportunities',
            });
        }
    },

    createGetOpportunitiesform: async (req, res) => {
        res.render('opportunity/getOpportunity/new.ejs');
    },

    createGetOpportunities: async (req, res) => {
        const { name, description, college, whatsapp, email, status } =
            req.body;

        try {
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
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error Adding Get Opportunity',
            });
        }
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
        if (!getOpportunity) {
            req.flash('error', 'Opportunity not found!');
            return res.redirect('/opportunity/getopportunities');
        }

        res.render('opportunity/getOpportunity/edit.ejs', { getOpportunity });
    },

    updateGetOpportunities: async (req, res) => {
        try {
            const id = req.params.id;
            const { name, description, college, whatsapp, email, status } =
                req.body;

            const updatedGetOpportunity =
                await GetOpportunity.findByIdAndUpdate(
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
        } catch (error) {
            res.status(500).json({ message: 'Error updating Get Opportunity' });
        }
    },

    deleteGetOpportunities: async (req, res) => {
        await GetOpportunity.findByIdAndDelete(req.params.id);
        res.redirect(`/opportunity/getopportunities`);
    },

    giveOpportunities: async (req, res) => {
        try {
            const allGiveOpportunities = await GiveOpportunity.find({})
                .populate('college')
                .populate('owner');

            res.render('opportunity/giveOpportunity/index.ejs', {
                allGiveOpportunities,
            });
        } catch (error) {
            res.status(500).json({
                message: 'Unable to Fetch Give Opportunity',
            });
        }
    },

    createGiveOpportunitiesform: async (req, res) => {
        res.render('opportunity/giveOpportunity/new.ejs');
    },

    createGiveOpportunities: async (req, res) => {
        const { name, description, college, whatsapp, email, status } =
            req.body;

        try {
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
        } catch (error) {
            res.status(500).json({
                message: 'Error Adding Give Opportunity',
            });
        }
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
        const { id } = req.params;
        const giveopportunity = await GiveOpportunity.findById(id);
        if (!giveopportunity) {
            req.flash('error', 'Opportunity not found!');
            return res.redirect('/opportunity/giveopportunities');
        }

        res.render('opportunity/giveOpportunity/edit.ejs', { giveopportunity });
    },

    updateGiveOpportunities: async (req, res) => {
        try {
            const id = req.params.id;
            const {
                name,
                description,
                college,
                whatsapp,
                email,
                status = true,
            } = req.body;

            const updatedGiveOpportunity =
                await GiveOpportunity.findByIdAndUpdate(
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
                return res
                    .status(404)
                    .json({ description: 'Opportunity not found' });
            }

            req.flash('success', 'Get Opportunity Updated Successfully');
            return res.redirect(`/opportunity/giveopportunities/${id}`);
        } catch (error) {
            res.status(500).json({
                message: 'Error updating Give Opportunity',
            });
        }
    },

    deleteGiveOpportunities: async (req, res) => {
        await GiveOpportunity.findByIdAndDelete(req.params.id);
        res.redirect(`/opportunity/giveopportunities`);
    },
};
