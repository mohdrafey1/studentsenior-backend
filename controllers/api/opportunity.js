const { GetOpportunity, GiveOpportunity } = require('../../models/Opportunity');
const { errorHandler } = require('../../utils/error');

module.exports = {
    getOpportunities: async (req, res) => {
        const allGetOpportunities = await GetOpportunity.find({
            status: true,
            isDeleted: false,
        })
            .populate('college')
            .populate('owner');

        res.json(allGetOpportunities);
    },

    getOpportunitiesByCollege: async (req, res) => {
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
    },

    createGetOpportunities: async (req, res) => {
        const { name, description, college, whatsapp, email } = req.body;

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
    },

    updateGetOpportunities: async (req, res) => {
        const id = req.params.id;
        const {
            name,
            description,
            college,
            whatsapp,
            email,
            status = true,
        } = req.body;

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
            return next(errorHandler(404, 'Opportunity not found'));
        }

        res.status(201).json({
            message: 'Get Opportunity Updated',
            updatedGetOpportunity,
        });
    },

    deleteGetOpportunities: async (req, res) => {
        const id = req.params.id;
        const deletedOpportunity = await GetOpportunity.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
        });

        if (!deletedOpportunity) {
            return next(errorHandler(404, 'Opportunity not found'));
        }

        res.status(200).json({
            message: 'Get Opportunity deleted (soft delete)',
        });
    },

    giveOpportunities: async (req, res) => {
        const allGiveOpportunities = await GiveOpportunity.find({
            status: true,
            isDeleted: false,
        })
            .populate('college')
            .populate('owner');

        res.json(allGiveOpportunities);
    },

    giveOpportunities: async (req, res) => {
        const { collegeId } = req.params;

        const allGiveOpportunities = await GiveOpportunity.find({
            status: true,
            isDeleted: false,
            college: collegeId,
        })
            .sort({ createdAt: -1 })
            .populate('college')
            .populate('owner');

        res.json(allGiveOpportunities);
    },

    createGiveOpportunities: async (req, res) => {
        const { name, description, college, whatsapp, email } = req.body;

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
            return next(errorHandler(404, 'Opportunity not found'));
        }

        res.status(201).json({
            message: 'Give Opportunity Updated',
            updatedGiveOpportunity,
        });
    },

    deleteGiveOpportunities: async (req, res) => {
        const id = req.params.id;
        const deletedOpportunity = await GiveOpportunity.findByIdAndUpdate(id, {
            isDeleted: true,
            deletedAt: new Date(),
        });

        if (!deletedOpportunity) {
            return next(errorHandler(404, 'Opportunity not found'));
        }

        res.status(200).json({
            message: 'Give Opportunity deleted (soft delete)',
        });
    },
};
