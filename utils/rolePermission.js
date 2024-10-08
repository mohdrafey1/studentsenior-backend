module.exports = function authorizeRole(role) {
    return (req, res, next) => {
        const user = req.user.toObject();
        console.log(user.role);

        if (user.role !== role) {
            req.flash(
                'error',
                "You don't have permission as you are a Visitor."
            );
            const previousUrl = req.get('Referer') || '/';
            return res.redirect(previousUrl);
        }
        next();
    };
};
