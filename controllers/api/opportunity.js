const { GetOpportunity, GiveOpportunity } = require('../../models/Opportunity');

module.exports = {
    getOpportunities: async (req, res) => {
        try {
            const allGetOpportunities = await GetOpportunity.find({
                status: true,
                isDeleted: false,
            })
                .populate('college')
                .populate('owner');

            res.json(allGetOpportunities);
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: 'Unable to Fetch Get Opportunities',
            });
        }
    },

    getOpportunitiesByCollege: async (req, res) => {
        try {
            const { collegeId } = req.params;
            const allGetOpportunities = await GetOpportunity.find({
                status: true,
                isDeleted: false,
                college: collegeId,
            })
                .sort({ createdAt: -1 })
                .populate('college')
                .populate('owner');

            res.json(allGetOpportunities);
        } catch (err) {
            console.error(err);
            res.status(500).json({
                message: 'Unable to Fetch Get Opportunities',
            });
        }
    },

    createGetOpportunities: async (req, res) => {
        const { name, description, college, whatsapp, email } = req.body;

        try {
            let owner = req.user.id;
            const newGetOpportunity = new GetOpportunity({
                name,
                description,
                college,
                whatsapp,
                email,
                owner,
            });
            await newGetOpportunity.save();
            res.status(201).json({
                message: 'Get Opportunity Created Successfully',
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: `${error}`,
            });
        }
    },

    updateGetOpportunities: async (req, res) => {
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
                return res
                    .status(404)
                    .json({ message: 'Opportunity not found' });
            }

            res.status(201).json({
                message: 'Get Opportunity Updated',
                updatedGetOpportunity,
            });
        } catch (error) {
            res.status(500).json({ message: 'Error updating Get Opportunity' });
        }
    },

    deleteGetOpportunities: async (req, res) => {
        try {
            const id = req.params.id;
            const deletedOpportunity = await GetOpportunity.findByIdAndUpdate(
                id,
                {
                    isDeleted: true,
                    deletedAt: new Date(),
                }
            );

            if (!deletedOpportunity) {
                return res
                    .status(404)
                    .json({ message: 'Opportunity not found' });
            }

            res.status(200).json({
                message: 'Get Opportunity deleted (soft delete)',
            });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting Get Opportunity' });
        }
    },

    giveOpportunities: async (req, res) => {
        try {
            const allGiveOpportunities = await GiveOpportunity.find({
                status: true,
                isDeleted: false,
            })
                .populate('college')
                .populate('owner');

            res.json(allGiveOpportunities);
        } catch (error) {
            res.status(500).json({
                message: 'Unable to Fetch Give Opportunity',
            });
        }
    },

    giveOpportunities: async (req, res) => {
        const { collegeId } = req.params;
        try {
            const allGiveOpportunities = await GiveOpportunity.find({
                status: true,
                isDeleted: false,
                college: collegeId,
            })
                .sort({ createdAt: -1 })
                .populate('college')
                .populate('owner');

            res.json(allGiveOpportunities);
        } catch (error) {
            res.status(500).json({
                message: 'Unable to Fetch Give Opportunity',
            });
        }
    },

    createGiveOpportunities: async (req, res) => {
        const { name, description, college, whatsapp, email } = req.body;

        try {
            let owner = req.user.id;
            const newGiveOpportunity = new GiveOpportunity({
                name,
                description,
                college,
                whatsapp,
                email,
                owner,
            });
            await newGiveOpportunity.save();
            res.status(201).json({
                message: 'Give Opportunity Created Successfully',
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error Adding Give Opportunity',
            });
        }
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
                    .json({ message: 'Opportunity not found' });
            }

            res.status(201).json({
                message: 'Give Opportunity Updated',
                updatedGiveOpportunity,
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error updating Give Opportunity',
            });
        }
    },

    deleteGiveOpportunities: async (req, res) => {
        try {
            const id = req.params.id;
            const deletedOpportunity = await GiveOpportunity.findByIdAndUpdate(
                id,
                {
                    isDeleted: true,
                    deletedAt: new Date(),
                }
            );

            if (!deletedOpportunity) {
                return res
                    .status(404)
                    .json({ message: 'Opportunity not found' });
            }

            res.status(200).json({
                message: 'Give Opportunity deleted (soft delete)',
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error deleting Give Opportunity',
            });
        }
    },
};
