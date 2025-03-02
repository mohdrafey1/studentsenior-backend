const Client = require('../../models/Client');
const ContactUs = require('../../models/ContactUs.js');
const AddPoint = require('../../models/AddPoint.js');
const DashboardUser = require('../../models/DashboardUser.js');
const { Branch, Course } = require('../../models/CourseBranch.js');
const Subjects = require('../../models/Subjects.js');
const Transaction = require('../../models/Transaction.js');
const AffiliateProduct = require('../../models/AffiliateProduct.js');
const RedemptionRequest = require('../../models/RedemptionRequest.js');

module.exports.otherStats = async (req, res) => {
    // Run all queries in parallel for better performance
    const [
        totalClient,
        totalContactUs,
        totalAddPointRequest,
        totalDashboardUser,
        totalBranch,
        totalCourse,
        totalSubjects,
        totalTransactions,
        totalRedemptionRequest,
        totalAffiliateProduct,
    ] = await Promise.all([
        Client.countDocuments(),
        ContactUs.countDocuments(),
        AddPoint.countDocuments(),
        DashboardUser.countDocuments(),
        Branch.countDocuments(),
        Course.countDocuments(),
        Subjects.countDocuments(),
        Transaction.countDocuments(),
        RedemptionRequest.countDocuments(),
        AffiliateProduct.countDocuments(),
    ]);

    res.status(200).json({
        totalClient,
        totalContactUs,
        totalAddPointRequest,
        totalDashboardUser,
        totalBranch,
        totalCourse,
        totalSubjects,
        totalTransactions,
        totalRedemptionRequest,
        totalAffiliateProduct,
    });
};
