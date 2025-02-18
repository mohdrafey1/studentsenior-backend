const User = require('../../models/User');
const { errorHandler } = require('../../utils/error');

module.exports.signupForm = (req, res) => {
    res.render('users/signup.ejs');
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        // console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome to Student Senior Dashboard');
            res.redirect('/');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/user/signup');
    }
};

module.exports.loginForm = (req, res) => {
    res.render('users/login.ejs');
};

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome Back to Student Senior Dashboard');
    let redirectUrl = res.locals.redirectUrl || '/';
    res.redirect(redirectUrl);
};

module.exports.profile = async (req, res) => {
    res.render('users/profile.ejs');
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You are Logged out!');
        res.redirect('/user/login');
    });
};
