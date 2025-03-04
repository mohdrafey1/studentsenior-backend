const Affiliate = require('../../models/AffiliateProduct');
const Colleges = require('../../models/Colleges');
const Store = require('../../models/Store');

module.exports.allAffiliateProducts = async (req, res) => {
    const affiliateProducts = await Affiliate.find({}).sort({ createdAt: -1 });

    res.status(200).json(affiliateProducts);
};

module.exports.allStoreProducts = async (req, res) => {
    const { collegeName } = req.params;

    const college = await Colleges.findOne({ slug: collegeName });

    const collegeId = college._id;

    const allProducts = await Store.find({ college: collegeId })
        .populate('college')
        .populate('owner')
        .sort({ createdAt: -1 });

    res.status(200).json(allProducts);
};
