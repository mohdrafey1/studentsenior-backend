const Seniors = require('../../models/Senior');
const { errorHandler } = require('../../utils/error');

module.exports.fetchSenior = async (req, res) => {
    const seniors = await Seniors.find({ status: true });
    res.json(seniors);
};

module.exports.fetchSeniorByCollege = async (req, res) => {
    const { collegeId } = req.params;
    const seniors = await Seniors.find({
        status: true,
        college: collegeId,
    })
        .populate('owner', 'profilePicture')
        .sort({ priority: 1 });
    res.json(seniors);
};

// module.exports.fetchSeniorById = async (req, res) => {
//         const { id } = req.params;
//         const senior = await Seniors.findOne({
//             status: true,
//             _id: id,
//         }).populate('owner', 'profilePicture');
//         if (!senior) {
//             return next(errorHandler(  'Senior not found' ));
//         }
//         await Seniors.findByIdAndUpdate(id, { $inc: { clickCount: 1 } });
//         res.json(senior);
// };

module.exports.fetchSeniorBySlug = async (req, res) => {
    const { slug } = req.params;

    const senior = await Seniors.findOneAndUpdate(
        { slug: slug, status: true },
        { $inc: { clickCount: 1 } },
        { new: true }
    ).populate('owner', 'profilePicture');

    if (!senior) {
        return next(errorHandler(404, 'Senior not found'));
    }

    res.json(senior);
};

module.exports.createSenior = async (req, res) => {
    const createSlug = (name) => {
        return `${name}`
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    const { name, domain, branch, year, whatsapp, telegram, college, status } =
        req.body;

    let owner = req.user.id;

    let slug = createSlug(name);

    let existingSenior = await Seniors.findOne({ slug });

    let counter = 1;

    while (existingSenior) {
        slug = `${createSlug(name)}-${counter}`;
        existingSenior = await Seniors.findOne({ slug });
        counter++;
    }

    const newSenior = new Seniors({
        name,
        domain,
        branch,
        whatsapp,
        telegram,
        year,
        college,
        slug,
        status,
        owner,
    });

    await newSenior.save();

    res.json({
        message: 'Senior submitted successfully and is pending approval.',
    });
};

module.exports.updateSenior = async (req, res) => {
    const { id } = req.params;
    const { name, domain, branch, year, whatsapp, telegram, college } =
        req.body;
    // console.log(req.body);

    const updatedSenior = await Seniors.findByIdAndUpdate(
        id,
        {
            name,
            domain,
            branch,
            year,
            whatsapp,
            telegram,
            college,
        },
        { new: true }
    );

    if (!updatedSenior) {
        return next(errorHandler(404, 'Senior not found'));
    }

    res.json({
        description: 'Senior updated successfully',
        updatedSenior,
    });
};

module.exports.deleteSenior = async (req, res) => {
    const senior = await Seniors.findById(req.params.id);
    if (!senior) {
        return next(errorHandler(404, 'Senior not found'));
    }

    await Seniors.findByIdAndDelete(req.params.id);

    res.status(200).json({
        message: 'Senior has been deleted successfully',
    });
};
