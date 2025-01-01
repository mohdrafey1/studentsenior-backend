const User = require('../models/User');

module.exports.signupForm = (req, res) => {
    res.render('users/signup.ejs');
};

module.exports.signup = async (req, res) => {
    let { username, email, password, college } = req.body;
    let newUser = new User({ email, username, college });
    const registererdUser = await User.register(newUser, password);
    req.login(registererdUser, (err) => {
        if (err) {
            return next(err);
        }
        req.flash('succcess', 'Welcome to Studetent Senior ');
        res.redirect('/');
    });
};

module.exports.loginForm = (req, res) => {
    res.render('users/login.ejs');
};

module.exports.login = async (req, res) => {
    let redirectUrl = res.locals.redirectUrl || '/';
    res.redirect(redirectUrl);
};

module.exports.profile = async (req, res) => {
    res.render('users/profile.ejs');
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash('success', 'you are logged out');
        return res.redirect('/');
    });
};
