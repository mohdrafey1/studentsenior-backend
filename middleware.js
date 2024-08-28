const Colleges = require('./models/Colleges');
const ExpressError = require('./utils/ExpressError.js');
const { collegeSchema, pyqSchema, groupSchema } = require('./schema.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You Must Be Logged in ');
        return res.redirect('/login');
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
