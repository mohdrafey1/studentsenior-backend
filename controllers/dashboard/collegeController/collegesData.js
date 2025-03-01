const Senior = require('../../../models/Senior.js');
const Store = require('../../../models/Store.js');
const Groups = require('../../../models/WhatsappGroup');
const Notes = require('../../../models/Notes');
const Post = require('../../../models/Post.js');
const { GiveOpportunity } = require('../../../models/Opportunity');
const PyqRequest = require('../../../models/PyqRequest.js');
const NewPyqs = require('../../../models/NewPyqs.js');
const LostFound = require('../../../models/LostFound.js');
const Colleges = require('../../../models/Colleges.js');

module.exports.collegeData = async (req, res) => {
    try {
        const { slug } = req.params;
        if (!slug) {
            return res.status(400).json({ error: 'College slug is required' });
        }

        const college = await Colleges.findOne({ slug });
        if (!college) {
            return res.status(404).json({ error: 'College not found' });
        }

        const collegeId = college._id;

        // Run all queries in parallel for better performance
        const [
            totalGroups,
            totalNotes,
            totalSeniors,
            totalProduct,
            totalPost,
            totalGiveOpportunity,
            totalRequestedPyqs,
            totalNewPyqs,
            totalLostFound,
        ] = await Promise.all([
            Groups.countDocuments({ college: collegeId }),
            Notes.countDocuments({ college: collegeId }),
            Senior.countDocuments({ college: collegeId }),
            Store.countDocuments({ college: collegeId }),
            Post.countDocuments({ college: collegeId }),
            GiveOpportunity.countDocuments({ college: collegeId }),
            PyqRequest.countDocuments({ college: collegeId }),
            NewPyqs.countDocuments({ college: collegeId }),
            LostFound.countDocuments({ college: collegeId }),
        ]);

        res.status(200).json({
            totalGroups,
            totalNotes,
            totalSeniors,
            totalProduct,
            totalPost,
            totalGiveOpportunity,
            totalRequestedPyqs,
            totalNewPyqs,
            totalLostFound,
        });
    } catch (error) {
        console.error('Error fetching college data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
