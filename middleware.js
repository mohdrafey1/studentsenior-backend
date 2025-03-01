const Colleges = require('./models/Colleges');
const ExpressError = require('./utils/ExpressError.js');
const {
    collegeSchema,
    pyqSchema,
    groupSchema,
    notesSchema,
    seniorSchema,
    storeSchema,
    postSchema,
    opportunitySchema,
    lostFoundSchema,
    dashBoardUserSchema,
} = require('./schema.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You Must Be Logged in ');
        return res.redirect('/user/login');
    }
    next();
};

module.exports.isRafey = (req, res, next) => {
    if (!req.isAuthenticated() || req.user.username !== 'rafey1') {
        req.flash('error', 'Access restricted to Rafey only');
        return res.redirect('/');
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let college = await Colleges.findById(id);
    if (!college.owner.equals(res.locals.currUser._id)) {
        req.flash('error', 'you dont have permission to edit');
        return res.redirect(`/colleges/${id}`);
    }

    next();
};

module.exports.validateColleges = (req, res, next) => {
    let { error } = collegeSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validatePyq = (req, res, next) => {
    let { error } = pyqSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateGroup = (req, res, next) => {
    let { error } = groupSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateNotes = (req, res, next) => {
    let { error } = notesSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateSenior = (req, res, next) => {
    let { error } = seniorSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateStore = (req, res, next) => {
    let { error } = storeSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validatePost = (req, res, next) => {
    let { error } = postSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateOpportunity = (req, res, next) => {
    let { error } = opportunitySchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateLostFound = (req, res, next) => {
    let { error } = lostFoundSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateDashboardUser = (req, res, next) => {
    let { error } = dashBoardUserSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// validateApiKey.js
module.exports.validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY;

    if (apiKey === validApiKey) {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden: Invalid API Key' });
    }
};
