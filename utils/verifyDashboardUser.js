const jwt = require('jsonwebtoken');
const { errorHandler } = require('./error');

module.exports.verifyDashboardUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return next(errorHandler(401, 'Unauthorized: No token provided'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(
                errorHandler(401, 'Unauthorized: Token expired or invalid')
            );
        }

        req.user = decoded;
        next();
    });
};

module.exports.requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};
