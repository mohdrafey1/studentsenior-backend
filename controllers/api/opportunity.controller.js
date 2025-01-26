const { GetOpportunity, GiveOpportunity } = require('../../models/Opportunity');
const { errorHandler } = require('../../utils/error');

const createSlug = (name) => {
    return `${name}`
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

const createUniqueSlug = async (model, name) => {
    let slug = createSlug(name);
    let existingOpportunity = await model.findOne({
        slug: { $regex: `^${slug}(-\\d+)?$`, $options: 'i' },
    });
    let counter = 1;

    while (existingOpportunity) {
        slug = `${createSlug(name)}-${counter}`;
        existingOpportunity = await model.findOne({
            slug: { $regex: `^${slug}$`, $options: 'i' },
        });
        counter++;
    }

    return slug;
};

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
            .populate('college', 'name')
            .populate('owner', 'username');

        res.json(allGetOpportunities);
    },

    getOpportunitiesBySlug: async (req, res, next) => {
        const { slug } = req.params;
        const getOpportunities = await GetOpportunity.find({
            status: true,
            isDeleted: false,
            slug: slug,
        })
            .sort({ createdAt: -1 })
            .populate('college', 'name')
            .populate('owner', 'username');

        if (!getOpportunities) {
            return next(errorHandler(404, 'Not Found'));
        }

        res.json(getOpportunities);
    },

    createGetOpportunities: async (req, res) => {
        const { name, description, college, whatsapp, email } = req.body;

        let owner = req.user.id;

        const slug = await createUniqueSlug(GetOpportunity, name);

        const newGetOpportunity = new GetOpportunity({
            name,
            description,
            college,
            whatsapp,
            email,
            owner,
            slug,
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

    // giveOpportunities: async (req, res) => {
    //     const allGiveOpportunities = await GiveOpportunity.find({
    //         status: true,
    //         isDeleted: false,
    //     })
    //         .populate('college', 'name')
    //         .populate('owner', 'username');

    //     res.json(allGiveOpportunities);
    // },

    giveOpportunities: async (req, res) => {
        const { collegeId } = req.params;

        const allGiveOpportunities = await GiveOpportunity.find({
            status: true,
            isDeleted: false,
            college: collegeId,
        })
            .sort({ createdAt: -1 })
            .populate('college', 'name')
            .populate('owner', 'username');

        res.json(allGiveOpportunities);
    },

    giveOpportunitiesBySlug: async (req, res, next) => {
        const { slug } = req.params;
        console.log(slug);

        const giveOpportunities = await GiveOpportunity.find({
            status: true,
            isDeleted: false,
            slug: slug,
        })
            .sort({ createdAt: -1 })
            .populate('college', 'name')
            .populate('owner', 'username');

        if (!giveOpportunities) {
            return next(errorHandler(404, 'Not Found'));
        }

        res.json(giveOpportunities);
    },

    createGiveOpportunities: async (req, res) => {
        const { name, description, college, whatsapp, email } = req.body;

        const slug = await createUniqueSlug(GiveOpportunity, name);

        let owner = req.user.id;
        const newGiveOpportunity = new GiveOpportunity({
            name,
            description,
            college,
            whatsapp,
            email,
            owner,
            slug,
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
